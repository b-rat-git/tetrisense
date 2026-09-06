// tetris-remote.js
// Remote control layer for Tetris → Lovense toys

$(function () {
  // SimplePeer connection and role state
  var tetrisConnection = null;
  var tetrisPeerRole = null; // 'host' (Lovense owner) or 'player' (remote Tetris player)

  // -------------------------------------------------------------------
  // Host / Player role buttons
  // -------------------------------------------------------------------

  $('#tetris-host').on('click', function () {
    tetrisPeerRole = 'host';

    tetrisConnection = new SimplePeer({ initiator: true, trickle: false });
    setupTetrisPeer();

    $('#tetris-role-row').find('button').removeClass('btn-success').addClass('btn-secondary');
    $('#tetris-host').removeClass('btn-secondary').addClass('btn-success');

    $('#tetris-connect-container').show();
  });

  $('#tetris-player').on('click', function () {
    tetrisPeerRole = 'player';

    tetrisConnection = new SimplePeer({ initiator: false, trickle: false });
    setupTetrisPeer();

    $('#tetris-role-row').find('button').removeClass('btn-success').addClass('btn-secondary');
    $('#tetris-player').removeClass('btn-secondary').addClass('btn-success');

    $('#tetris-connect-container').show();
  });

   $('#valentines-host').on('click', function () {
    connection = new SimplePeer({ initiator: true, trickle: false });

    setupPeer();
    $('#valentines-host-client').hide();
    $('#valentines-connect-container').show();
    $('#valentines-host-instructions').show();

    isHost = true;
  });

  $('#valentines-client').on('click', function () {
    connection = new SimplePeer({ initiator: false, trickle: false });

    setupPeer();
    $('#valentines-host-client').hide();
    $('#valentines-connect-container').show();
    $('#valentines-client-instructions').show();

    isHost = false;
  });

  $('#valentines-copyconnectcode').on('click', function () {
    var content = $('#valentines-yourconnectcode').val();

    navigator.clipboard.writeText(content)
      .then(function () {
        $('#valentines-copyconnectcode').text('Copied!');
        setTimeout(function () {
          $('#valentines-copyconnectcode').text('Copy');
        }, 1000);
      })
      .catch(function (err) {
        $('#valentines-copyconnectcode').text('Error ;-;');
      });
  });

  function setupPeer() {
    connection.on('signal', function (data) {
      $('#valentines-yourconnectcode').val(btoa(JSON.stringify(data)));
    });

    connection.on('connect', function () {
      console.log('Valentines - CONNECTED');
      $(
        '#valentines-connect-container, ' +
        '#valentines-host-instructions, ' +
        '#valentines-client-instructions'
      ).hide();
      $('#valentines-main').show();

  $('#tetris-copyconnectcode').on('click', function (e) {
    e.preventDefault();

    var content = $('#tetris-yourconnectcode').val();
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content)
      .then(function () {
        $('#tetris-copyconnectcode').text('Copied!');
        setTimeout(function () {
          $('#tetris-copyconnectcode').text('Copy');
        }, 1000);
      })
      .catch(function () {
        $('#tetris-copyconnectcode').text('Error ;-;');
      });
  });

  // -------------------------------------------------------------------
  // Peer setup: signalling + data channel for Tetris events
  // -------------------------------------------------------------------

  function setupTetrisPeer() {
    if (!tetrisConnection) {
      return;
    }

    // When SimplePeer produces a signal (offer/answer),
    // encode it as base64 JSON and show in "Your Connect Code"
    tetrisConnection.on('signal', function (data) {
      var code = btoa(JSON.stringify(data));
      $('#tetris-yourconnectcode').val(code);
    });

    // When peer is connected, you can optionally tweak UI here
    tetrisConnection.on('connect', function () {
      console.log('Tetris remote - CONNECTED');

      // You can hide the connect UI if you want once connected:
      // $('#tetris-connect-container').hide();
    });

    // Incoming data from the other side
    tetrisConnection.on('data', function (buf) {
      try {
        var msg = JSON.parse(buf.toString());

        // For Tetris we expect { game: 'tetris', event: {...} }
        if (msg.game === 'tetris' && msg.event) {
          // Only the host should actually drive toys
          if (tetrisPeerRole === 'host') {
            handleTetrisEventLocally(msg.event);
          }
        }
      }
      catch (err) {
        console.error('Tetris remote - bad data', err);
      }
    });

    tetrisConnection.on('error', function (err) {
      if (err.message === 'cannot send after peer is destroyed' || err.code === 'ERR_DESTROYED') {
        alert('Tetris connection closed. Please refresh the page to reconnect.');
      } else {
        console.error('Tetris remote - error', err);
      }
    });

    // "Peer's Connect Code" → signal into SimplePeer
    $('#tetris-submitpeercode').off('click').on('click', function (e) {
      e.preventDefault();
      var peerCode = $('#tetris-peercode').val().trim();
      if (!peerCode) {
        return;
      }

      try {
        var signalData = JSON.parse(atob(peerCode));
        tetrisConnection.signal(signalData);
      }
      catch (err) {
        console.error('Tetris remote - bad peer code', err);
      }
    });
  }

  // -------------------------------------------------------------------
  // Global event bridge for Tetris (called from tetris.js)
  // -------------------------------------------------------------------
  //
  // tetris.js will call: notifyToyControl({ type: 'gameOver', ... })
  // and notifyToyControl({ type: 'rowsCleared', level, totalRows, intense })

  window.notifyToyControl = function (event) {
    // If this browser is the remote player and we have a connection,
    // send the event to the host over the data channel
    if (tetrisPeerRole === 'player' && tetrisConnection && tetrisConnection.connected) {
      var payload = {
        game: 'tetris',
        event: event
      };

      try {
        tetrisConnection.send(JSON.stringify(payload));
      }
      catch (err) {
        console.error('Tetris remote - send failed', err);
      }

      return;
    }

    // If this browser is the host (Lovense owner) or there is no
    // peer role set, handle the event locally against Lovense toys
    if (tetrisPeerRole === 'host' || !tetrisPeerRole) {
      handleTetrisEventLocally(event);
    }
  };

  // -------------------------------------------------------------------
  // Local handler: map game events → Lovense vibrations
  // -------------------------------------------------------------------
  //
  // Relies on:
  //   - enabledToys (array of IDs) from connection.js
  //   - lovense.sendVibration(id, intensity, duration) from lan-mod.js

  function handleTetrisEventLocally(event) {
    if (!window.enabledToys || !Array.isArray(enabledToys) || enabledToys.length === 0) {
      return;
    }

    // GAME OVER: big vibration hit
    if (event.type === 'gameOver') {
      var intensity = event.intensity || 20;
      var duration = event.duration || 5;

      enabledToys.forEach(function (toyId) {
        lovense.sendVibration(toyId, intensity, duration);
      });

      return;
    }

    // ROWS CLEARED: scale vibrations by level and number of rows
    if (event.type === 'rowsCleared') {
      var level = event.level || 1;
      var totalRows = event.totalRows || 1;
      var intense = !!event.intense;

      var vibrationLevel = level * totalRows * 1.5;
      if (vibrationLevel > 20) {
        vibrationLevel = 20;
      }

      enabledToys.forEach(function (toyId) {
        lovense.sendVibration(
          toyId,
          Math.abs(vibrationLevel),
          intense ? 2 : 1 // same idea as original: linger a bit on intense
        );
      });

      if (intense) {
        // Follow-up vibration based on level, capped at 20
        setTimeout(function () {
          var lvlVibrate = level;
          if (lvlVibrate > 20) {
            lvlVibrate = 20;
          }

          enabledToys.forEach(function (toyId) {
            lovense.sendVibration(toyId, lvlVibrate, 0);
          });
        }, 1000);
      }

      return;
    }

    // Add more event types later if you extend the mini-game logic
  }
});
