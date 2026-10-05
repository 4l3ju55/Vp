const express = require('express');
const fs = require('fs').promises;
//moodul urli lahtiharutamiseks, et saaks post osad kättesaadavaks
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks, promises osaga async proge jaoks
const mysql = require('mysql2/promise');

const dateET = require('./src/dateTimeET');

const textRef = 'Public/txt/vanasonad.txt';
const regTextRef = 'Public/txt/visits.txt';

//moodul .env lugemiseks ja keskkonnamuutujate parsimiseks
require('dotenv').config();

//Käivitan express.js funktsiooni ja anna nimeks "app"
const app = express();
app.use(bodyparser.urlencoded({extended: false}));
//määrame veebilehtedele mallide renderdamise mootori
app.set ('view engine', 'ejs');
//määran kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('Public'));

//marsruudid
app.get('/', (req, res)=>{
	//res.send('Express.js läks käima ja serveerib meile veebi.');
	const dayNow = dateET.weekDay();
	const dateNow = dateET.fullDate(0);
	const timeNow = dateET.fullTime();
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/vanasona', async(req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]})
		
	}
	catch (err) {
		res.render('vanasona', {wisdom: 'Ei leidnud ühtegi vanasõna!'});
	}
});

app.get('/minust', (req, res)=>{
    res.render('minust');
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	try {
		await fs.open(regTextRef, 'a');

		const dateNow = dateET.fullDate(0);
		const timeNow = dateET.fullTime();

		await fs.appendFile(regTextRef, req.body.nameInput + ', ' + dateNow + ', ' + timeNow + ';');

		res.render('regvisit');
	}
	catch (err){
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/lastvisit', async(req, res)=>{
	try {
		const data = await fs.readFile(regTextRef, 'utf8');
		let visits = data.split(';');
		let lastVisit = visits[visits.length - 2];
		let visitData = lastVisit.split(',');

		res.render('lastvisit', {
			name: visitData[0],
			date: visitData[1],
			time: visitData[2]
		});
	}
	catch (err) {
		console.log(err);
		res.render('lastvisit', {
			name: 'puudub',
			date: 'puudub',
			time: 'puudub'
		});
	}
});

app.get('/eestifilm', (req, res) => {
	res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async (req, res) => {
	//console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilm_inimesed', {personList: sqlRes});
	}
	catch (err){
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilm_inimesed', {personList: []});
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
	
});

app.get('/eestifilm/inimesed_add', (req, res) =>{
	res.render('inimesed_add', {notice: 'Ootan sisestust!'});
});

app.post('/eestifilm/inimesed_add', async (req, res) =>{
	console.log(req.body);
	//kontrollime andmete olemasolu
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()) {
		console.log('Andmed pole korrektsed');
		return res.render('inimesed_add', {notice: 'Andmed on puudulikud!'});
	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		let deceasedDate = null;
		if(req.body.deceasedInput !=''){
			deceasedDate = req.body.deceasedInput;
		}
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			req.body.deceasedInput
		]);
		res.render('inimesed_add', {notice: 'Andmed salvestati, ootan uut sisestust!'});
	}
	catch(err){
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('inimesed_add', {notice: 'Andmebaasiga tekkis viga!'});
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
	
});



app.listen(5134)