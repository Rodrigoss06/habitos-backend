import { getSession } from '../services/neo4j.service.js';

export const createUser = async (req, res) => {
  const { id, nombre, email } = req.body;
  const session = getSession();

  try {
    await session.run(
      `
      MERGE (u:Usuario {id: $id})
      SET u.nombre = $nombre, u.email = $email
      `,
      { id, nombre, email }
    );

    res.status(201).json({ message: 'Usuario creado o actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear o actualizar el usuario.' });
  } finally {
    await session.close();
  }
};

export const createHabit = async (req, res) => {
  const { id, nombre, categoria } = req.body;
  const session = getSession();

  try {
    await session.run(
      `
      MERGE (h:Habito {id: $id})
      SET h.nombre = $nombre, h.categoria = $categoria
      `,
      { id, nombre, categoria }
    );

    res.status(201).json({ message: 'Hábito creado o actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear o actualizar el hábito.' });
  } finally {
    await session.close();
  }
};

export const linkUserToHabit = async (req, res) => {
  const { userId, habitId } = req.body;
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (u:Usuario {id: $userId}), (h:Habito {id: $habitId})
      MERGE (u)-[:SIGUE]->(h)
      `,
      { userId, habitId }
    );

    res.status(200).json({ message: 'Hábito vinculado al usuario exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al vincular el hábito al usuario.' });
  } finally {
    await session.close();
  }
};

export const getUserHabits = async (req, res) => {
  const { userId } = req.params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:Usuario {id: $userId})-[:SIGUE]->(h:Habito)
      RETURN h
      `,
      { userId }
    );

    const habits = result.records.map(record => record.get('h').properties);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los hábitos del usuario.' });
  } finally {
    await session.close();
  }
};

export const getHabitSuggestions = async (req, res) => {
  const { userId } = req.params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:Usuario {id: $userId})-[:SIGUE]->(h:Habito)<-[:RELACIONADO_CON]-(s:Habito)
      WHERE NOT (u)-[:SIGUE]->(s)
      RETURN DISTINCT s LIMIT 5
      `,
      { userId }
    );

    const suggestions = result.records.map(record => record.get('s').properties);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sugerencias de hábitos.' });
  } finally {
    await session.close();
  }
};
