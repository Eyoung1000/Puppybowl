  // Get elements
  const playerContainer = document.getElementById('all-players-container');
  const newPlayerFormContainer = document.getElementById('new-player-form');
  let viewDetailsButtons = document.querySelectorAll('.view-details');
  let removePlayerButtons = document.querySelectorAll('.remove-player');
   console.log(viewDetailsButtons);
  // API URL
  const APIURL = 'https://fsa-puppy-bowl.herokuapp.com/api/2305-FTB-ET-WEB-PT';
  /**
   * Fetches all players from the API and returns them
   * @returns {Array} An array of player objects.
   */
  const fetchAllPlayers = async () => {
    try {
      const response = await fetch(`${APIURL}/players`);
      const players = await response.json ();
      return players;
    } catch (error) {
      console.error('Uh oh, trouble fetching players!', error);
    }
  };
  // Fetches a single player from the API by playerId
  const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}/players/${playerId}`);
      const player = await response.json ();
      return player;
    } catch (error) {
      console.log(error);
    }
  };
  /*
  * Adds a new player to the API
  * @param {Object} playerObj - The player object to be added.
  * @returns {Object} The added player object.
  */
  const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(`${APIURL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerObj),
      });
      const addedPlayer = await response.json();
      return addedPlayer;
    } catch (error) {
      console.error('Oops, something went wrong with adding that player!', error);
    }
  };
  /**
  * Removes a player from the API by playerId
  * @param {number} playerId - The ID of the player to remove.
  */
  const removePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}/players/${playerId}`, {
        method: 'DELETE',
      });
  const player =await response.json();
  fetchAllPlayers();
  //reload window
  window.location.reload();
    } catch (error) {
      console.log(error)
    }
  };
  /**
   * It takes an array of player objects, loops through them, and creates a string of HTML for each
   * player, then adds that string to a larger string of HTML that represents all the players.
   *
   * Then it takes that larger string of HTML and adds it to the DOM.
   *
   * It also adds event listeners to the buttons in each player card.
   *
   * The event listeners are for the "See details" and "Remove from roster" buttons.
   *
   * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
   * API to get the details for a single player.
   *
   * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
   * the API to remove a player from the roster.
   *
   * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
   * Renders all players to the DOM
   * @param {Array} playerList - An array of player objects.
   */
  const renderAllPlayers = (playerList) => {
      try {
      console.log(playerList);
        //const playerContainer = document.getElementById('all-players-container');
        //if (!playerContainer) {
          //console.error("Player container not found.");
          //return;
        //}
        //if (!Array.isArray(playerList.data.players)) {
          //console.error("playerList is not an array:", playerList);
          //return;
        //}
        const players = playerList.data.players; // Access the "players" array
        console.log(players);
        const playerContainerHTML = players.map((player) => `
          <div class="player-card">
            <img src="${player.imageUrl}" alt="${player.name}" class="player-image">
            <h2>${player.name}</h2>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <button class="view-details" data-id="${player.id}">View Details</button>
            <button class="remove-player" data-id="${player.id}">Remove Player</button>
          </div>
        `).join('');
        playerContainer.innerHTML = playerContainerHTML;
      } catch (error) {
        console.error('Uh oh, trouble rendering players', error);
      }
    };
  // It  renders a form to the DOM, and whenthe form is submitted, a new player isadded to the database,
  // fetches all players from the database, and renders themto the DOM
  const renderNewPlayerForm = () => {
      try {
        newPlayerFormContainer.innerHTML = `
          <form id="new-player-form">
            <input type="text" name="name" placeholder="Name" required>
            <input type="text" name="breed" placeholder="Breed" required>
            <select name="status" required>
              <option value="bench">Bench</option>
              <option value="field">Field</option>
            </select>
            <input type="url" name="imageUrl" placeholder="Image URL" required>
            <button type="submit">Add Player</button>
          </form>
        `;
        const newPlayerForm = document.getElementById('new-player-form');
        newPlayerForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const name = event.target.elements.name.value;
          const breed = event.target.elements.breed.value;
          const status = event.target.elements.status.value;
          const imageUrl = event.target.elements.imageUrl.value;
          try {
            await addNewPlayer({ name, breed, status, imageUrl });
            // Re-render the roster after adding a player
            init();
            // Clear form inputs
            newPlayerForm.value="";
          } catch (error) {
            console.error('Error adding player:', error);
          }
        });
      } catch (error) {
        console.error('Uh oh, trouble rendering the new player form', error);
      }
    };
   // Attach event listeneers to show details and remove players
    const updatebuttons = () =>{
      viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
          console.log("buttonclick");
        const playerId = button.dataset.id;
          fetchSinglePlayer(playerId)
            .then((player) => {
              console.log(player);
              // display player details in an alert pop-up
              alert(`Player Details:
      Name: ${player.data.player.name}
      Breed: ${player.data.player.breed}
      Status: ${player.data.player.status}
      Created At: ${player.data.player.createdAt}
      Updated At: ${player.data.player.updatedAt}
      Team ID: ${player.data.player.teamId}
      Cohort ID: ${player.data.player.cohortId}
      Team: ${player.data.player.team}`);
            })
            .catch((error) => {
              console.error('Error fetching player details:', error);
            });
        });
      });
      removePlayerButtons.forEach(button => {
        button.addEventListener('click', () => {
          const playerId = button.dataset.id;
          removePlayer(playerId)
            .then(() => {
              // Render the roster after a player is removed
              init();
            })
            .catch((error) => {
              console.error('Error removing player:', error);
            });
        });
      });
      try {
        // Your try block code here (it probably contains the renderAllPlayers and renderNewPlayerForm functions)
      } catch (error) {
        console.error('Uh oh, trouble rendering players', error);
      };
     }
    const init = async () => {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        renderNewPlayerForm();
        viewDetailsButtons = document.querySelectorAll('.view-details');
        removePlayerButtons = document.querySelectorAll('.remove-player');
        console.log(viewDetailsButtons);
        updatebuttons ();
    };
    init();
