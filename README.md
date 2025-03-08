# Apps.Receipt.Processor
An application that detects receipt and records expenses with data from the receipt using a multimodal LLM.

<h2 >How to set up 💻</h2>

<ol>
  <li>Have a Rocket.Chat server ready. If you don't have a server, see this <a href="https://docs.rocket.chat/docs/deploy-rocketchat">guide</a>.</li> 
  <li style="margin-bottom: 1rem;">Install the Rocket.Chat Apps Engine CLI. </li>

```
npm install -g @rocket.chat/apps-cli
```

Verify if the CLI has been installed

```
rc-apps -v
```

  <li style="margin-bottom: 1rem;">Clone the GitHub Repository</li>
    
```
git clone https://github.com/RocketChat/Apps.Receipts.Processor.git
```
  
<li style="margin-bottom: 1rem;">Install app dependencies</li>
  
```
cd Apps.Receipts.Processor
yarn install
```
  
  <li style="margin-bottom: 1rem;">Deploy the app to the server </li>
  
  ```
  rc-apps deploy --url <server_url> --username <username> --password <password>
  ```
  
  - If you are running the server locally, the default `server_url` is http://localhost:3000.
  - `username` is the username of your admin user.
  - `password` is the password of your admin user.
</ol>
