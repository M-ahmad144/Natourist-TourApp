const fs = require('fs');
const express = require('express');

const app = express(); // Creating an instance of an Express application

//This middleware ensures that incoming request bodies are parsed as JSON.
app.use(express.json());


// Reading and parsing tour data from a JSON file
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));


// GET request for all tours
app.get("/api/v1/tours", (req, res) => {
    // api version - Ensures clients using older versions of the API won't break when new versions are released, and allows changes in v2 without breaking v1 users.
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
});

//get request responding to the url parmeters
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params)
    res.status(200).json({
        status: "success",
    })
})

//post request
app.post('/api/v1/tours', (req, res) => {
    // Determine the new ID based on the last tour's ID
    const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
    // Create the new tour object
    const newTour = Object.assign({ id: newId }, req.body);

    // Add the new tour to the tours array
    tours.push(newTour);

    // Write the updated tours array to the JSON file
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({
                status: 'fail',
                message: 'Error writing to file'
            });
        }

        // Respond with the newly created tour
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
});

const port = 3000; // Setting the port number for the server to listen on
// Starting the server and listening for incoming requests on the specified port 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
