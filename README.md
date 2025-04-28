Pic-meal is a product where users can take a picture of their meal or food items,
and get an instant details about them like calorie, vitamins, fats, carbs etc.

Currently this is in a building phase.

To test the project and contribute:

 Clone the repo
- `
git clone https://github.com/Satya-Prakash-Dwivedi/pic-meal.git`

POSTMAN Testing
- Create a .env in the root folder
- Insert your own `GEMINI API KEY`
- Start the server = `python food.py`

send a POST request to 
`http://localhost:8000/recognize`

Along with data in form-data
- key - image
- type - file
- value - upload_image

