# get-link-fshare
Enter a fshare file code and return the download link
## run
```bash
redis-server
node /scripts/update-remain-traffic.js
npm start
```
## database
- key "total_accounts"
- hash "account:x" (x is a number) include fields: "user_email", "password", "app_key", "user_agent", "token", "session_id", "remain"
- hash "slot" include fields: "0", "1", "2", ..., 3*total_accounts - 1; each field had one of three state: "available", "unavailable", "using"
## update log
### v2.1
- re-construct, non-tested
### v2.0.1 
- enable 'trust proxy' 
- enable shorten url
### v2.0 non-tested
- update fshare api from v1

