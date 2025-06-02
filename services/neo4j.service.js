import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

console.log('NEO4J_URI:', process.env.NEO4J_URI);
console.log('NEO4J_USERNAME:', process.env.NEO4J_USER);
console.log('NEO4J_PASSWORD:', process.env.NEO4J_PASSWORD ? '****' : 'no definido');
if (!uri || !user || !password) {
  throw new Error('Faltan variables de entorno para Neo4j');
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const getSession = () => driver.session();
