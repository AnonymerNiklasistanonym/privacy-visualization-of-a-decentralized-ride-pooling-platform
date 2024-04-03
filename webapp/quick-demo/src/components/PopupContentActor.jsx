
import Button from '@components/Button';


export function PopupContentCustomer({ customer, spectatorState }) {
  return (<>
    {Object.keys(customer).filter(key => !["id", "type", "currentLocation", "currentArea", "passengers",
      "rideRequest",
      "participantDb",
      "auctionsDb"].includes(key)).map(key => {
        if (spectatorState !== "everything" && spectatorState !== customer.id) {
          return <p>{key}: *****</p>
        }
      return <p>{key}: {customer[key]}</p>
})}
  </>)
}

export function PopupContentRideProvider({ rideProvider, spectatorState }) {
  const content = [];
  for (const key in rideProvider) {
    let value = <></>
    if (["id", "type", "currentLocation", "currentArea",
      "rideRequest",
      "participantDb",
      "auctionsDb"].includes(key)) {
      continue;
    }
    if (key === "passengers") {
      value = <>
        <p>{key}:</p>
        <ul className="scrolling">{rideProvider[key].map((a, index) => <li key={`${rideProvider.id}_${key}_${index}`}>{a}</li>)}</ul>
      </>
    } else {
      value = <p>{key}: {rideProvider[key]}</p>
    }
    content.push(value)
  }

  return (<>
    {content}
  </>)
}

export default function PopupContentActor({ actor, spectatorState, setStateSpectator }) {
  const content = [];
  for (const key in actor) {
    if (["id", "type", "currentLocation", "currentArea"].includes(key)) {
      continue;
    }
    if (actor.hasOwnProperty(key)) {
      const title = <p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em">
      {key}:
    </p>
      const titleValue = <p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em">
      {key}: {actor[key]}
    </p>
      if (key === "passengers") {
        content.push(title, <ul className="scrolling">{actor[key].map(a => <li>{a}</li>)}</ul>)
      } else if (key === "rideRequest") {
        content.push(title, <ul className="scrolling"><li>state: {actor[key]['state']}</li><li>destination: {actor[key]['address']}</li></ul>)
      } else if (key === "participantDb") {
        content.push(title, <ul className="scrolling">{actor[key].map(a => <><li>{a.contactDetails.id}</li><ul>${a.pseudonyms.map(b => <li>{b}</li>)}</ul></>)}</ul>)
      } else if (key === "auctionsDb") {
        content.push(title, <ul className="scrolling">{actor[key].map(a => <li>{JSON.stringify(a)}</li>)}</ul>)
      } else {
        content.push(titleValue);
      }
    }
  }

  let actorContent = <></>
  if (actor.type === "customer") {
    actorContent = <PopupContentCustomer customer={actor} spectatorState={spectatorState} />
  }
  if (actor.type === "ride_provider") {
    actorContent = <PopupContentRideProvider rideProvider={actor} spectatorState={spectatorState} />
  }

  return (<>
    <h2>{actor.type} ({actor.id}) [{spectatorState}]</h2>
    {actorContent}
    <Button onClick={() => {
      console.log(`Change view to this spectator: ${actor.id}`);
      setStateSpectator(actor.id);
    }}>Change view to this actor</Button>
  </>)
}
