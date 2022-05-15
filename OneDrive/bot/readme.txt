1. Create new app https://discord.com/developers/ and new bot -> reset token to get new token
2. Go on heroku, create a new app and bot, go in deploy and link github
2bis. point 2 doesn't work..create new app with heroku cli -> a) install heroku: https://devcenter.heroku.com/articles/heroku-cli#verify-your-installation
3. On https://discord.com/developers/ in OAuth set up bot in General section and generate an invite with bot scopes in Url Generator section 
4. Insert the token you get on discord by clicking 'reset token' in the bot script
4. Add Procfile in the bot folder before push with the correct name of the js file as worker node
5. Push local folder with the bot to heroku (https://dashboard.heroku.com/apps/verification-bot-v2/deploy/heroku-git): 
cd 'path folder bot'; heroku git:remote -a 'name of the app on heroku'; git add .; git commit -am 'message'; git push heroku master