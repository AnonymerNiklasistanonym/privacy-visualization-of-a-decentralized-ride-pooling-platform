// Type imports
import type {Coordinates} from '../globals/types/coordinates';

export const osmnxServerRequest = async (
  source: Readonly<Coordinates>,
  target: Readonly<Coordinates>
): Promise<Coordinates[]> => {
  const result = await fetch(
    'http://localhost:5000/shortest_path_coordinates',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({source, target}),
    }
  ).then(data => data.json() as Promise<Coordinates[]>);
  return result;
};
