# Learning Management System

## For Developers

After cloning the repository:

1. Install nvm through [this URL](https://github.com/creationix/nvm)
2. run nvm install.
3. run `npm install`. This should install all the packages.
	
Create a .env file in the root folder with the variable:

1. `MYSQL_HOST`
2. `MYSQL_PORT`
3. `MYSQL_USER_NAME`
4. `MYSQL_PASSWORD`
5. `MYSQL_DB_NAME`
6. `MYSQL_MAX_CON=5`
7. `MYSQL_MIN_CON=0`
8. `MYSQL_ACQUIRE=30000`
9. `MYSQL_IDLE=10000`
10. `JWT_SECRET_KEY=M0iRz7l431uRoUwCSCgKIo49r+4knVMa+OBzLEp6`

## Create database and create a table , refer to users.js for table structure	
During the development process, run `npm start` or / `app.local.js`.
