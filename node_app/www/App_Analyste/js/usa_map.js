var map = new Datamap({
  element: document.getElementById("container"),
  scope: 'usa',
  fills: {
    defaultFill: "#323f61",
    win: '#0fa0fa'
  },
  data: {
    'TX': { fillKey: 'win' },
    'FL': { fillKey: 'win' },
    'NC': { fillKey: 'win' },
    'CA': { fillKey: 'win' },
    'NY': { fillKey: 'win' },
    'CO': { fillKey: 'win' }
  }
});
/* [{
  _id : ''
  origin : '',
  destination : '',
  date : '',
}] */
