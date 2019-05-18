import { SimulationContext } from './defs';
import { GekijoDirective } from './directives';

export type json = string;

export type SimulationContextLd = SimulationContext
  & { '@context': 'http://rengular.js.org/context/init.jsonld' };

export type CssLd = {
  '@context': {
    StyleAction: { '@id': 'ren:StyleAction' },
    styleList: { '@id': 'ren:styleList' },
    matchMedia: { '@id': 'ren:matchMedia' },
    color: 'http://rengular.js.org/schema/CssStyle#color',
    position: 'http://rengular.js.org/schema/CssStyle#position',
    target: 'http://rengular.js.org/schema/CssStyle#target',
    width: 'http://rengular.js.org/schema/CssStyle#width',
    height: 'http://rengular.js.org/schema/CssStyle#height',
    '@vocab': 'http://rengular.js.org/schema/CssStyle#'
  },
  '@type': 'StyleAction',
  [property: string]: any,
};

export interface ComponentSchema {
  '@context': ['http://rengular.js.org/context/common.jsonld', {
    stylingTo: { '@id': 'schema:target' },
  }];
  /** The [IRI](https://www.w3.org/TR/json-ld/#dfn-iri) denoting this component */
  id: string;
  /** The ComponentDef Type this node representing */
  '@type': string;
  'http://rengular.js.org/schema/backgroundImage'?: string;
  '@reverse': {
    /* TODO: rename to createComponent */
    'schema:target'?: {
      '@type': 'ComponentAction',
      /** The component id would be used as the property in Scene */
      object: ComponentSchema,
    }[],
    /* TODO: rename to stylingTo */
    stylingTo?: CssLd[],
  };
}

interface SceneBase extends ComponentSchema {
  /** The [IRI](https://www.w3.org/TR/json-ld/#dfn-iri) denoting this scene */
  id: string;
}

export interface SceneLd extends SceneBase {
  '@type': 'http://rengular.js.org/schema/Scene';
}

export type GekijoDirectiveLd = GekijoDirective & {
  '@context': 'http://rengular.js.org/context/common.jsonld',
};

export interface GekijoLd extends SceneBase {
  '@type': 'http://rengular.js.org/schema/Gekijo';
  program: GekijoDirectiveLd[];
}
