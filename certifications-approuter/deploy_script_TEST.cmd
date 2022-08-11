REM choose environment and space
call cf target -o learninghub3_test -s stay_current

REM deploy app
call cf push --strategy rolling --vars-file vars_TEST.yml
