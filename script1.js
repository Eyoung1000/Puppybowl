// Get elements
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// API URL
const APIURL = 'https://fsa-puppy-bowl.herokuapp.com/api/2305-FTB-ET-WEB-PT';


/**
 * Fetches all players from the API and returns them
 * @returns {Array} An array of player objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const players = await response.json();
    return players;
  } catch (error) {
    console.error('Uh oh, trouble fetching players!', error);
    return[];
  }
};


// Fetches a single player from the API by playerId

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`);
    const player = await response.json();
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
      const response = await fetch(`${APIURL}/players${playerId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete player.');
      }
  
      const removedPlayer = await response.json();
      return removedPlayer;
    } catch (error) {
      console.error('Error removing player:', error);
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
    const playerContainer = document.getElementById('all-players-container');
    if (!playerContainer) {
      console.error("Player container not found.");
      return;
    }

    if (!Array.isArray(playerList.data.players)) {
      console.error("playerList is not an array:", playerList);
      return;
    }

    // Remove the inner renderAllPlayers function
    console.log(playerList);
    const playerContainerHTML = playerList.data.players.map((player) => `
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
      
  

    // Attach event listeneers to show details and remove players
const viewDetailsButtons = document.querySelectorAll('.view-details');
const removePlayerButtons = document.querySelectorAll('.remove-player');

viewDetailsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const playerId = button.dataset.id;
      fetchSinglePlayer(playerId)
        .then((player) => {
          console.log(player);
          // display player details in an alert pop-up
          alert(`Player Details:
  Name: ${player.name}
  Breed: ${player.breed}
  Status: ${player.status}
  Created At: ${player.createdAt}
  Updated At: ${player.updatedAt}
  Team ID: ${player.teamId}
  Cohort ID: ${player.cohortId}
  Team: ${player.team}`);
        })
        .catch((error) => {
          console.error('Error fetching player details:', error); 
        });
    });
  });


 
removePlayerButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const playerId = button.dataset.id;
    try {
      await removePlayer(playerId);
      // Remove the player's card from the DOM
      const playerCard = button.closest('.player-card');
      playerCard.remove();
    } catch (error) {
      console.error('Error removing player:', err);
    }
  });
});
  
  
  try {
    // Your try block code here (it probably contains the renderAllPlayers and renderNewPlayerForm functions)
  } catch (error) {
    console.error('Uh oh, trouble rendering players', error);
  }
  

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
          newPlayerForm.reset();
        } catch (error) {
          console.error('Error adding player:', error);
        }
      });
    } catch (error) {
      console.error('Uh oh, trouble rendering the new player form', error);
    }
  };
  
  const init = async () => {
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
  
      renderNewPlayerForm();
 
  };
  init();
