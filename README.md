# OpenTabletop
Browser-based online project in which you can play any card games with your friends

## Firebase rules

    {
      "rules": {
        ".read": "false",
        ".write": "false",
        "test": {
          ".read": "true",
          ".write": "true"
        },
        "users": {
          "$uid": {
            ".read": "$uid === auth.uid",
            ".write": "$uid === auth.uid",
            "friends":{
              ".read":"true",
              "$friend":{
                "email":{
                  ".validate": "newData.isString() && newData.val().matches(/^[a-z0-9](\\.?[a-z0-9]){5,}@g(oogle)?mail\\.com$/i)"
                },
                "lobby":{
                  ".read": "$uid === auth.uid || data.parent().child('email').val() === auth.token.email",
                  ".write": "$uid === auth.uid || data.parent().child('email').val() === auth.token.email"
                }
              }
            }
          }
        },
        "emails": {
          ".read": "true",
          ".write": "false",
          "$email":{
            ".write": "$email === auth.token.email.replace('.', ',')"
          }
        }
      }
    }
