// Package imports
import {useEffect, useState} from 'react';
// Local imports
// > Globals
import {constants} from 'lib_globals';
// > Misc
import {debugComponentElementUpdate} from '@misc/debug';
// Type imports
import {GlobalPropsFetch, GlobalPropsShowError} from '@misc/props/global';
import {SimulationEndpointParticipantIdFromPseudonym} from 'lib_globals';

export default function useResolvePseudonym(
  pseudonym: string | undefined,
  {fetchJsonSimulation, showError}: GlobalPropsFetch & GlobalPropsShowError
) {
  debugComponentElementUpdate(`useResolvePseudonym#${pseudonym}`);

  // React: States
  // > Fetching of actual actor ID in case it was a pseudonym
  const [stateResolvedPseudonym, setStateResolvedPseudonym] = useState<
    SimulationEndpointParticipantIdFromPseudonym | undefined
  >(undefined);

  // React: State change listener
  // > In case the actor ID is a pseudonym fetch the actual actor ID
  useEffect(() => {
    if (pseudonym) {
      debugComponentElementUpdate(`useResolvePseudonym#${pseudonym}#useEffect`);
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        constants.endpoints.simulation.apiV1.participantIdFromPseudonym(
          pseudonym
        )
      )
        .then(data => setStateResolvedPseudonym(data))
        .catch(err =>
          showError('Simulation fetch participant ID from pseudonym', err)
        );
    }
  }, [fetchJsonSimulation, showError, pseudonym]);

  return stateResolvedPseudonym;
}
