import { Facet, FacetTypes } from './Facet';
import { Term } from './Term';
export interface TermFacet extends Facet {
    type: FacetTypes.TERM | FacetTypes.BOOLEAN;
    terms?: Term[];
}
