# segment-debugger

To run app:

1. Clone repository: "git clone https://github.com/spaul5/segment-debugger.git"
2. "cd segment-debugger"
3. "docker-compose pull"
4. "docker-compose up -d"
5. "cd server"
5. "npm install && node src/api-server.js"
6. open up a new terminal tab with (command/control)-t
7. "cd ../client"
8. "npm install && npm run start"

This should open up the app in a new tab on your browser.
If not, go to localhost:4200

To stop running the app
control-c in both terminal windows,
go to the segment-debugger directory, and then run "docker-compose down"
