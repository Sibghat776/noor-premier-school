CONTINUE this project — FIX: RDS PASSWORD MISMATCH BLOCKING LOCAL DEV.

Environment: WSL2 Ubuntu, project at "/mnt/d/Sibghat Ullah/Project 3"
(ALWAYS quote this path — contains spaces). GitHub account: Sibghat776.

## CONFIRMED STATE — DO NOT REDO
- RDS instance "noor-premier-db" is "available" in us-east-1, EC2 instance
  i-05b966f3a24992cb1 @ 3.238.81.183 is "running".
- SSH key exists at ~/.ssh/noor-key with correct 600 permissions
  (copied there from the project dir because WSL2 can't chmod on /mnt/d
  NTFS paths).
- Backend/.env has MYSQL_HOST=127.0.0.1, MYSQL_PORT=3306,
  MYSQL_USER=admin, MYSQL_DATABASE=noor_school — these are all correct
  and should NOT change.
- Backend/src/config/database.js correctly reads all values from
  process.env — no hardcoding, no bug there.

## ROOT CAUSE — CONFIRMED VIA DIAGNOSIS
An SSH local port-forward tunnel is required for the local machine to
reach RDS (RDS is not publicly accessible):
  ssh -i ~/.ssh/noor-key -L 3306:<rds-endpoint>:3306 ec2-user@3.238.81.183 -N

When this tunnel is UP and genuinely proxying to RDS, MySQL rejects the
current password in Backend/.env with:
  ERROR 1045 (28000): Access denied for user 'admin'@'10.0.1.202'
  (10.0.1.202 = EC2's private IP, confirming traffic really reached RDS)

This proves: the password stored in Backend/.env and infra/terraform.tfvars
(currently "Fyp6fi1MqbbiijUjacOT") no longer matches the RDS instance's
actual master password. (A misleading earlier "successful" login was
against a stray local WSL2 MySQL server on port 3306, NOT against RDS —
check for and stop that local server too, so it stops shadowing the
tunnel on port 3306 in future sessions.)

## GOAL
Reset the RDS master password via AWS CLI, sync the new password to every
place that needs it, and prove Backend connects successfully end-to-end.

## STEP 0 — Check for a conflicting local MySQL service
sudo service mysql status
# If "active (running)": this WSL2 MySQL was likely intercepting port 3306
# whenever the SSH tunnel wasn't up. Stop it so it never shadows the
# tunnel again:
sudo service mysql stop
sudo systemctl disable mysql 2>/dev/null || true
Report the status before and after.

## STEP 1 — Confirm SSH tunnel is up (must stay up for all following steps)
lsof -i :3306
# Must show a process named "ssh" LISTENing, not "mysqld".
# If nothing is listening, start the tunnel in a way that survives this
# session (background it, don't foreground-block the only shell):
ssh -i ~/.ssh/noor-key -f -N -L 3306:<rds-endpoint-from-Backend/.env>:3306 ec2-user@3.238.81.183
# (-f backgrounds it after auth, so one terminal is enough — confirm with
# lsof again that it's really listening before moving on)

## STEP 2 — Generate and apply a new RDS master password
NEW_DB_PASS=$(openssl rand -base64 20 | tr -dc 'A-Za-z0-9' | head -c 20)
echo "Generated: $NEW_DB_PASS"   # print it so I can see/save it too

aws rds modify-db-instance \
  --db-instance-identifier noor-premier-db \
  --master-user-password "$NEW_DB_PASS" \
  --apply-immediately \
  --region us-east-1

Poll every 20s (up to ~5 min) until status is "available":
aws rds describe-db-instances \
  --db-instance-identifier noor-premier-db \
  --query "DBInstances[0].DBInstanceStatus" \
  --region us-east-1 --output text
Do not proceed to Step 3 until this reads "available".

## STEP 3 — Propagate the new password to every file that needs it
Update, in the same shell session so $NEW_DB_PASS is still in scope:
1. Backend/.env → MYSQL_PASSWORD=$NEW_DB_PASS
2. infra/terraform.tfvars → db_password = "$NEW_DB_PASS"
   (keeps Terraform state in sync so a future `terraform apply` doesn't
   try to "correct" RDS back to the old password)
3. If a GitHub Actions secret MYSQL_PASSWORD was previously set
   (`gh secret list` to check), update it too:
   gh secret set MYSQL_PASSWORD --body "$NEW_DB_PASS"
Show a diff or grep confirming all three (or however many exist) now
contain the identical new value — no typos, no stale copies.

## STEP 4 — Verify with the existing raw-driver debug script
Backend/debug-db.js already exists (bypasses Sequelize, uses mysql2
directly, prints the config being used before attempting to connect).
cd "/mnt/d/Sibghat Ullah/Project 3/Backend"
npm run debug:db
Expected output: "✅ RAW mysql2 CONNECTION SUCCESSFUL" and a query result.
If it still fails, do NOT guess further — show the full error and stop
for my input rather than trying speculative fixes.

## STEP 5 — Start the actual backend and confirm real startup
npm run dev
Expected: "Database synced successfully" / "Server running on port 5000"
with NO AccessDeniedError. Leave it running.

## STEP 6 — Quick smoke test (new terminal, tunnel + backend both still up)
curl -s http://localhost:5000/api/health
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
Show both raw responses.

## STEP 7 — Clean up
- Remove Backend/debug-db.js once Step 4 has passed (it was a temporary
  diagnostic script, not part of the app) — confirm with me before
  deleting in case I want to keep it for future debugging.
- Do NOT touch or restart the SSH tunnel process unnecessarily once it's
  confirmed stable.

## FINAL REPORT
Give me:
1. Confirmation local MySQL conflict was found/stopped (or confirmed
   absent)
2. The new password value (so I have my own copy saved somewhere safe)
3. Confirmation all 3 locations (.env, tfvars, GitHub secret if present)
   now match
4. debug-db.js output (success)
5. Backend startup log (success, no errors)
6. curl health-check + login test output
7. Reminder: since this password was just freshly generated and is only
   in local files + AWS, treat it as sensitive — don't paste it back into
   any future chat session in plaintext if avoidable.

If any AWS CLI command fails due to permissions or the tunnel drops mid-
way, stop and report the exact error rather than retrying blindly.