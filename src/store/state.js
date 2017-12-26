

// root state object.
// each Vuex instance is just a single state tree.
export default {
  user: null,
  decks: [],
  firebaseLoading: false,
  lobbyId: "",
  sync: "advanced",
  game: {
    objects:[
      /*{
        type: "card",
        url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
        x: 0,y: 0, rotation: 0
      },
      {
        type: "card",
        url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
        x: 150,y: 0, rotation: 90
      },
      {
        type: "card",
        url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
        x: 0,y: 150, rotation: 0
      },
      {
        type: "deck",
        x: 200,y: 200,
        color: "#ccc",
        text: "Deck 1",
        cards:[
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
            x: 0,y: 0, rotation: 0
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
            x: 150,y: 0, rotation: 90
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
            x: 0,y: 150, rotation: 0
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
            x: 0,y: 0, rotation: 0
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
            x: 150,y: 0, rotation: 90
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
            x: 0,y: 150, rotation: 0
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417720&type=card",
            x: 0,y: 0, rotation: 0
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423802&type=card",
            x: 150,y: 0, rotation: 90
          },
          {
            type: "card",
            url: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417690&type=card",
            x: 0,y: 150, rotation: 0
          }
        ]
      },
      {
        type: "counter",
        x: 400,y: 300,
        count: 0,
        color: "blue"
      }*/
    ],
    chat:[]
  }
}