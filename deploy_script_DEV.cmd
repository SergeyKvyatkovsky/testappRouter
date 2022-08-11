xcopy /Y resources\dev\xs-app.json approuter
xcopy /Y resources\dev\xs-security.json .

REM choose environment and space
call cf target -o learininghub3_dev -s stay_current

REM deploy app
call cf push --strategy rolling --vars-file vars_DEV.yml
