const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express(); // Creating an instance of an Express application

//Middlewares

//This middleware ensures that incoming request bodies are parsed as JSON.
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from the middlware ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));
// Reading and parsing tour data from a JSON file
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

//Tours Route Handlers
const getAllTours = (req, res) => {
  // api version - Ensures clients using older versions of the API won't break when new versions are released, and allows changes in v2 without breaking v1 users.
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((e) => e.id === id);

  if (!tours) {
    res.status(404).json({
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

//Users Route Handlers
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented',
  });
};

// Creating the Express Router instances for tours and users
const tourRouter = express.Router();
const userRouter = express.Router();

// tours routes
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// users routes
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Mounting the Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//start server`
const port = 3000; // Setting the port number for the server to listen on
// Starting the server and listening for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
