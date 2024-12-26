$("[type=button]").click(function () {
	let ingredients = $("#ingredients").val();
	let cuisine = $("#cuisine").val();
	$.ajax({
		url: "https://api.openai.com/v1/chat/completions", // Replace if using a custom endpoint
		method: "POST",
		headers: {
			Authorization: `Bearer `,
			"Content-Type": "application/json",
		},
		data: JSON.stringify({
			model: "gpt-4o-mini", // Custom model name
			messages: [
				{ role: "system", content: `Is a chatbot that the response should be properly stylized with HTML but is not a code and in English` },
				{
					role: "assistant",
					content: `<title>Italian Style Chicken and Potato Recipe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            margin: 20px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 2px 2px 12px rgba(0,0,0,0.1);
        }
        h1 {
            color: #c0392b;
        }
        h2 {
            color: #27ae60;
        }
        ul {
            list-style-type: square;
        }
        .ingredients {
            background-color: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
        }
        .instructions {
            background-color: #e8f8f5;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
<h1>Italian Style Chicken and Potato</h1>
    <h2>Ingredients:</h2>
    <div class="ingredients">
        <ul>
            <li>4 chicken thighs</li>
            <li>4 medium potatoes, peeled and diced</li>
            <li>1 cup heavy cream</li>
            <li>3 cloves garlic, minced</li>
            <li>1 teaspoon dried oregano</li>
            <li>1 teaspoon dried basil</li>
            <li>Salt and pepper to taste</li>
            <li>2 tablespoons olive oil</li>
            <li>Fresh parsley, chopped (for garnish)</li>
        </ul>
    </div>

    <h2>Instructions:</h2>
    <div class="instructions">
        <ol>
            <li>Preheat your oven to 400°F (200°C).</li>
            <li>In a large oven-safe skillet, heat the olive oil over medium heat.</li>
            <li>Season the chicken thighs with salt, pepper, oregano, and basil. Add the chicken to the skillet and brown on all sides, about 5-7 minutes.</li>
            <li>Remove the chicken from the skillet and set aside. In the same skillet, add garlic and sauté for 1 minute until fragrant.</li>
            <li>Add the diced potatoes to the skillet. Stir well to coat with the garlic.</li>
            <li>Pour the heavy cream over the potatoes, mixing until everything is well combined.</li>
            <li>Return the chicken to the skillet, placing it on top of the potatoes.</li>
            <li>Transfer the skillet to the preheated oven and bake for 30-35 minutes, or until the chicken is cooked through and the potatoes are tender.</li>
            <li>Remove from the oven and let it sit for a few minutes before serving. Garnish with fresh parsley.</li>
        </ol>
    </div>

    <h2>Enjoy your Italian-inspired meal!</h2><p></p></div>`,
				},
				{ role: "user", content: `Generate a recipe using these ingredients: ${ingredients} in ${cuisine} style.` },
			],
		}),
		success: function (response) {
			const recipe = response.choices[0].message.content.trim();
			$("#recipe-result").html(`<h2>Your Recipe:</h2><p>${recipe}</p>`);
		},
		error: function (xhr) {
			console.error(xhr.responseText);
			$("#recipe-result").html("<p>Failed to generate recipe. Please try again.</p>");
		},
	});
});
