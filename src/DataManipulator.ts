import { ServerRespond } from './DataStreamer';

export interface Row {
  price_ABC: number,
  price_DEF: number,
  timestamp: Date,
  ratio: number, // store ratio
  upper_bound: number, // upper bound for ratio
  lower_bound: number, // lower bound for ratio
  alert: number | undefined, // field for alerts
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
  const priceABC = (serverResponds[0] && serverResponds[0].top_ask && serverResponds[0].top_ask.price) || 0;
   const priceDEF = (serverResponds[1] && serverResponds[1].top_ask && serverResponds[1].top_ask.price) || 0;

    const ratio = priceABC/priceDEF; // ratio between stock ABC and DEF prices

    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    const alert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined // check if ratio exceeds bounds 
    
    const timestamp = new Date(
      serverResponds[0].timestamp > serverResponds[1].timestamp 
        ? serverResponds[0].timestamp 
        : serverResponds[1].timestamp
    );
      return {
        price_ABC: priceABC,
        price_DEF: priceDEF,
        timestamp: timestamp,
        ratio: ratio,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        alert: alert, // if bounds are crossed, alert
      };
  }
}
