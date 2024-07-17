const fs = require('fs');
const express = require('express');

const app = express(); // Creating an instance of an Express application

//This middleware ensures that incoming request bodies are parsed as JSON.
app.use(express.json());
// Reading and parsing tour data from a JSON file
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

const getAllTours = (req, res) => {
  // api version - Ensures clients using older versions of the API won't break when new versions are released, and allows changes in v2 without breaking v1 users.
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((e) => e.id === id);

  if (!tours) {
    return res.status(404).json({
      status: 'fail',
      message: 'Inavlid Id',
    });
  }
  // console.log(req.params)
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
  // Determine the new ID based on the last tour's ID
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  // Create the new tour object
  const newTour = Object.assign({ id: newId }, req.body);

  // Add the new tour to the tours array
  tours.push(newTour);

  // Write the updated tours array to the JSON file
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.error('Error writing to file', err);
        return res.status(500).json({
          status: 'fail',
          message: 'Error writing to file',
        });
      }

      // Respond with the newly created tour
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert id to a number
  // Check if the id is a valid number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<tour data...>',
    },
  });
};
const deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert id to a number
  // Check if the id is a valid number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// // GET request for all tours
// app.get('/api/v1/tours', getAllTours);
// //get request responding to the url parmeters
// app.get('/api/v1/tours/:id', getTour);
// //post request
// app.post('/api/v1/tours', createTour);
// //patch request
// app.patch('/api/v1/tours/:id', updateTour);
// //delete request
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000; // Setting the port number for the server to listen on
// Starting the server and listening for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
