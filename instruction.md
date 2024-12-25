Http endpoints for gatherspace

base url: http://localhost:3000/api

1. /signup - POST

   - body
     - {
       "username" : "username",
       "password" : "password",
       "role" : "Admin" || "User"
       }
   - response
     - {
       "userId" : "userId",
       }

2. /signin - POST

   - body
     - {
       "username" : "username",
       "password" : "password",
       }
   - response
     - {
       "token" : "token",
       }

3. /admin/element - POST

   - body
     - {
       "imageUrl" : "imageUrl",
       "width" : number,
       "height" : number,
       "staticValue" : boolean
       }
   - response - elementId
     - {
       "id" : "id",
       }

4. /admin/element/:id - PUT

   - body
     - {
       "imageUrl" : "imageUrl",
       }
   - response
   - 201 - image updated successfully

5. /admin/avatar - POST

   - body
     - {
       "imageUrl" : "imageUrl",
       "name" : "name",
       }
   - response
     - {
       "id" : "id",
       }

6. /admin/map - POST

   - body

     - {
       "thumbnail" : "thumbnailUrl",
       "dimensions" : "200x300", // width x height
       "name" : "name",
       "defaultElements" [
       {
       elementId : "elementId",
       x : number,
       y : number,

       }, {
       elementId : "elementId",
       x : number,
       y : number,
       }
       ]
       }

   - response
     - {
       "id" : "id",
       }

7. /user/metadata - POST

   - body

     - {
       "avatarId" : "avatarId",
       }

   - response
     - 200 - metadata updated successfully

8. /user/avatars - GET

   - response
     - {
       "avatars" : [
       {
       "id" : "avatarId",
       "imageUrl" : "imageUrl",
       "name" : "name"
       }, {
       "id" : "avatarId",
       "iamgeUrl": "imageUrl",
       "name" : "name"
       }, ...
       ]
       }

9. /user/metadata/bulk?ids=userId&ids=userId1&ids=userId2.. - GET

   - response
     - {
       "avatars" : [
       {
       "name": "New Avatar",
       "avatarUrl": "https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/08/mgidarccontentnickcomc008fa9d_d0.jpg",
       "userId": "d5a0d1ca-e86f-463b-bf46-9ad00eb0c3eb",
       "avatarId": "80086108-0cea-4b9c-a777-d3d6363fae30"
       }, ....
       ]
       }

10. /space - POST

- body

  - {
    "name" : "name",
    "dimensions" : "200x300", // width x height
    "mapId" : "mapId"
    }

- response
  - {
    "id" : "id",
    }

11. /space/:id - delete

- response
  - 204 - space deleted successfully

12. /space/all - GET

- response
  - {
    "spaces" : [
    {
    "id" : "spaceId",
    "name" : "name",
    "width" : number,
    "height: number,
    "thumbnail: "url",
    "creatorId": "userId",
    "elements" : [
    {
    "id" : "spaceElementid",
    "elementId" : "elementId",
    "spaceId" : "spaceId",
    "x" : number,
    "y" : number
    }, ...
    ]
    }, ...
    ]
    }

13. /space/:id - GET

- response
  - {
    "id" : "spaceId",
    "dimensions" : "200x300", // width x height
    "name" : "name",
    "thumbnail" : "url",
    "creatorId": "userId",
    "elements" : [
    {
    "id" : "SpaceElementid",
    "elementId" : "elementId",
    "spaceId" : "spaceId",
    "x" : number,
    "y" : number
    }, ...
    ]
    }

14. /space/element - POST

- body

  - {
    "elementId" : "elementId",
    "spaceId" : "spaceId",
    "x" : number,
    "y" : number
    }

- response
  - 201 - element added successfully

15. /space/element - DELETE

- body

  - {
    "id" : "spaceElementId"
    }

- response
  - 204 - element deleted successfully

16. /elements - GET

- response - {
  "elements": [
  {
  "id": "2325f63e-e389-410f-a924-0a01a256e02b",
  "width": 1,
  "height": 2,
  "staticValue": false,
  "imageUrl": "https://media.istockphoto.com/id/2175709582/photo/bee-close-up-on-a-flower.jpg?s=1024x1024&w=is&k=20&c=bgcoomESJn0i_0zspYm4yyDUk0dAHd2RZgyqdU0X2K4="
  },
  {
  "id": "9caf43ae-fa3c-444f-b53e-5022015d5698",
  "width": 2,
  "height": 2,
  "staticValue": false,
  "imageUrl": "https://media.istockphoto.com/id/2175709582/photo/bee-close-up-on-a-flower.jpg?s=1024x1024&w=is&k=20&c=bgcoomESJn0i_0zspYm4yyDUk0dAHd2RZgyqdU0X2K4==="
  }
  ]
  }

17. /maps - GET

- response - {
  "maps" : [
  {
  "id" : "mapId",
  "thumbnail" : "thumbnailUrl",
  "name" : "name",
  "height": int,
  "width": int,
  "thumbnail" : "string",
  "mapElements" : [
  {
  "id": "5c3aac14-de36-4134-af30-5b4733e1bc39",
  "mapId": "ee944ab3-9846-4add-be16-877bf3473e0a",
  "staticValue": false,
  "elementId": "2325f63e-e389-410f-a924-0a01a256e02b",
  "x": 20,
  "y": 20
  }
  ]
  }
  ]
  }

Websocket endpoints

baseUrl - ws://localhost:3000/ws

1. baseUrl - Connect to the websocket server

2. JOIN - Join a room

   - body
   - {
     "type": "join",
     "payload": {
     "token": "PASTE_YOUR_JWT_TOKEN_HERE",
     "spaceId": "some-space-id" // Replace with a valid space ID
     }
     }

   - response
   - Server sent events
     {
     "type": "space-joined",
     "payload": {
     "spawn": {
     "x": 2,
     "y": 3
     },
     "users": [{
     "id": 1,
     }]
     }
     }

3. MOVE - Move your avatar
   - body - {
     "type": "move",
     "payload": {
     "x": 1, // can be increase only by 1
     "y": 0 // can be increase only by 1
     // but both can't be increase at the same time
     }
     }

- response
- Server sent events - if movement is not allowed - {
  "type": "movement-rejected",
  "payload": {
  x: 2,
  y: 3
  }
  }

4.  Boradcast to everyone in the room

            - Move a particular user ((send to everyone but the user joined ))

                   - {
                  "type": "movement",
                  "payload": {
                    "x": 1,
                    "y": 2,
                    "userId": "123"
                  }

              }
            - When a user leaves the room ((send to everyone but the user joined ))
              - {
            "type": "user-left",
            "payload": {
            	"userId": 1
            }

            }

            - When a user joins the room (send to everyone but the user joined )
              - {
        "type": "user-join",
        "payload": {
        	"userId": 1,
        	"x": 1,
        	"y": 2
        }

    }

Disconnect - Disconnect from the websocket server

## Creating the interface

# Pages Required

1. Landing Page

   - contains info about the project (get from readme.md)
   - should be stylish and clean
   - can go to signup page or login page from here

2. Signup Page

   - contains signup form
   - should be stylish and clean
   - should have a back button to go back to landing page
   - also can move to login page from here

3. Login Page

   - contains login form
   - should be stylish and clean
   - should have a back button to go back to landing page
   - also can move to signup page from here

4. Dashboard Page

   - contains all the pre defined maps
   - contains all the spaces created by the user
   - should be stylish and clean
   - should have a logout button take me to the landing page
   - should have create space button to create a new space
   - should have create map button to create a new map
   - when i click on a space it should join me in

5. Create Space Page

   - contains create space form
   - should be stylish and clean
   - should have a back button to go back to dashboard page
   - should show a list of maps to choose from
   - or empty (no element)
   - after creating a space it should take me to the dashboard page
   - where i can see all the spaces created by me

6. Create Map Page

   - thumbnail shoudl be the background of the map (uploaded by the user)
   - should be stylish and clean
   - should have a back button to go back to dashboard page
   - should show a list of elements to choose from
   - or empty (no element)
   - should have a create button to create the map
   - after creating a map it should take me to the dashboard page
   - where i can see all the maps created by everyone

7. Create Element Page

   - contains create element form
   - should be stylish and clean
   - should have a back button to go back to dashboard page

8. Edit Space Page or Edit Map page(add element to the space or map)
   - here we can place the elements in the space or map
   - should be stylish and clean
9. Space Page

   - takes you to full screen view of the space
   - thumbnail image is drawn on the canvas
   - elements are drawn on the canvas
   - avatars are drawn on the canvas
   - when i use arrow keys it should move the avatar
   - when i use w,a,s,d it should move the avatar

10. User Profile Page

    - contains user profile info
    - should be stylish and clean
    - choose from the avatars options

11. Avatar creation Page

- contains avatar creation form
- should be stylish and clean
- should have a back button to go back to user profile page

thats all i have for now move can be added later
