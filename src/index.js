const { app, PORT } = require("./server");

const server = app.listen(PORT, () => {
	console.log(`Express server is running on port ${PORT}`);
});
