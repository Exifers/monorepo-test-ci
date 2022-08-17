import express, { Request, Response } from 'express'

const app = express();
const PORT = 3001;


app.get('/', (req: Request, res: Response) => {
	res.send('hello worldd 2');
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
