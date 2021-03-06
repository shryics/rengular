import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'app/interceptors';
import {
  GekijoLd, SceneLd, SimulationContextLd, CssLd, StaticSessionConfigLd,
} from 'app/renpi/rdf-schema';
import { SimpleEntry, SimpleNavi } from 'app/renpi';
import { ChoiceMenuLd } from 'app/modules/choice-menu';
import { LayeredImageLd } from 'app/modules/layered-image';
import { OarsPocketLd } from 'app/modules/oars-pocket';
import { TextboxLd } from 'app/modules/textbox';

interface SimpleEntryLd extends SimpleEntry {
  '@context': 'https://rengular.js.org/context/simple-entry.jsonld';
  '@type': 'http://rengular.js.org/schema/SimpleEntry';
  simpleNavi: SimpleNavi & {
    '@type': 'http://rengular.js.org/schema/SimpleNavi';
    '@context': 'https://rengular.js.org/context/simple-navi.jsonld';
  };
  staticSession: StaticSessionConfigLd[];
}

const TRANSLATION = {
  simpleEntry: {
    start: 'スタート（Start）',
    load: 'ロード',
    pref: '環境設定',
    help: 'ヘルプ',
    leave: '終了（Exit）',
  },
  oarsPocket: {
    back: '巻き戻し',
    history: '履歴',
    skip: 'スキップ',
    auto: 'オート',
    save: 'セーブ',
    quickSave: 'Q.セーブ',
    quickLoad: 'Q.ロード',
    prefs: '設定',
  },
};

const STYLES = {
  oarsPocket: {
    '@context': 'https://rengular.js.org/context/css.jsonld',
    '@type': 'StyleAction',
    matchMedia: 'ALL',
    width: '34em',
    position: 'absolute',
    marginTop: '-3em',
    right: '0',
    color: 'cornsilk',
  } as CssLd,
  bottomText: {
    '@context': 'https://rengular.js.org/context/css.jsonld',
    '@type': 'StyleAction',
    matchMedia: 'ALL',
    marginTop: '30em',
  } as CssLd,
};

const context: SimulationContextLd[] = [{
  '@context': 'https://rengular.js.org/context/init.jsonld',
  id: 'simple-quest',
  name: 'simple-quest',
  title: 'RenGULAR DEMO Script: Simple Quest',
  version: '1.0.0',
  interfaceVersion: 1,
  entryScene: '/ren-db/simple-quest/1',
  screenAspect: { width: 1066, height: 600, fontSize: 16 },
}];

const simpleQuestScenes = [
  {
    id: '1',
    '@context': 'https://rengular.js.org/context/simple-entry.jsonld',
    '@type': 'http://rengular.js.org/schema/SimpleEntry',
    simpleNavi: {
      '@context': 'https://rengular.js.org/context/simple-navi.jsonld',
      '@type': 'http://rengular.js.org/schema/SimpleNavi',
      topGap: 2,
      startScene: '/ren-db/simple-quest/2',
      labels: JSON.stringify(TRANSLATION.simpleEntry),
    },
    staticSession: [{
      '@type': 'http://rengular.js.org/schema/StaticSessionAction',
      name: 'auto-delay',
      value: '4000',
      targetType: 'http://rengular.js.org/schema/OarsPocket',
    }],
    '@reverse': {
      'schema:target': [{
        '@context': 'https://rengular.js.org/context/css.jsonld',
        '@type': 'StyleAction',
        matchMedia: 'ALL',
        'background-image': 'url(assets/demo-bg/quest-entry.png)',
        'background-position': 'bottom',
      } as CssLd],
    },
  } as SimpleEntryLd,
  {
    id: '2',
    '@context': 'https://rengular.js.org/context/common.jsonld',
    '@type': 'http://rengular.js.org/schema/Scene',
    createComponent: [
      {
        '@type': 'ComponentAction',
        object: {
          '@context': 'https://rengular.js.org/context/common.jsonld',
          id: './textbox',
          '@type': 'Textbox',
          text: 'The Goal is to save the princess against the Devil.',
          stylingTo: [STYLES.bottomText],
        } as TextboxLd,
      }, {
        '@type': 'ComponentAction',
        object: {
          '@context': 'https://rengular.js.org/context/common.jsonld',
          id: './oarsPocket',
          '@type': 'OarsPocket',
          nextScene: '/ren-db/simple-quest/3',
          'OarsPocket:#labels': JSON.stringify({ skip: 'Next' }),
          stylingTo: [STYLES.oarsPocket],
        } as OarsPocketLd,
      }
    ],
    'http://rengular.js.org/schema/backgroundImage': 'assets/demo-bg/bg_h08.jpg',
  } as SceneLd,
  // TODO: This scene could be merged into scene#2 as a gekijo program.
  {
    /** Choice Menu Sample */
    '@context': 'https://rengular.js.org/context/common.jsonld',
    id: '3',
    '@type': 'http://rengular.js.org/schema/Gekijo',
    createComponent: [{
      '@type': 'ComponentAction',
      object: {
        '@context': ['https://rengular.js.org/context/common.jsonld', {
          jumpToScene: { '@id': 'http://rengular.js.org/schema/nextScene', '@type': '@id' }
        }],
        id: './choices',
        '@type': 'ChoiceMenu',
        'ChoiceMenu:#choices': [
          { title: 'Left Door', jumpToScene: '/ren-db/simple-quest/4' },
          { title: 'Right Door', jumpToScene: '/ren-db/simple-quest/5' },
        ],
      } as ChoiceMenuLd,
    }, {
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './textbox',
        '@type': 'Textbox',
        text: 'Which door should I enter?',
        stylingTo: [STYLES.bottomText],
      } as TextboxLd,
    }, {
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './oarsPocket',
        '@type': 'OarsPocket',
        nextScene: '/ren-db/simple-quest/1',
        prevScene: '/ren-db/simple-quest/2',
        'OarsPocket:#labels': JSON.stringify({ skip: 'Next' }),
        stylingTo: [STYLES.oarsPocket],
      } as OarsPocketLd,
    }],
    backgroundImage: 'assets/demo-bg/bg_h08.jpg',
    program: [],
  } as GekijoLd,
  {
    /** Happy End */
    '@context': 'https://rengular.js.org/context/common.jsonld',
    id: '4',
    '@type': 'http://rengular.js.org/schema/Scene',
    createComponent: [{
      '@type': 'ComponentAction',
      object: {
        '@context': ['https://rengular.js.org/context/common.jsonld', {
          imgUrl: { '@id': 'schema:image', '@type': '@id' },
        }],
        id: './heroine',
        '@type': 'LayeredImage',
        imgUrl: 'assets/demo-bg/ki_1_05.png',
        height: 34,
        stylingTo: [{
          '@context': 'https://rengular.js.org/context/css.jsonld',
          '@type': 'StyleAction',
          bottom: '0px',
          matchMedia: 'ALL',
          left: '10%',
        }],
      } as LayeredImageLd,
    }, {
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './textbox',
        '@type': 'Textbox',
        text: 'Thank you ~~ Happy RenGULAR',
        stylingTo: [{ ...STYLES.bottomText, ...{ textAlign: 'center' } }],
      } as TextboxLd,
    }, {
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './oarsPocket',
        '@type': 'OarsPocket',
        nextScene: '/ren-db/simple-quest/1',
        prevScene: '/ren-db/simple-quest/2',
        // labels: TRANSLATION.oarsPocket,
        'OarsPocket:#labels': JSON.stringify({ skip: 'Next' }),
        stylingTo: [STYLES.oarsPocket],
      } as OarsPocketLd,
    }],
    backgroundImage: 'assets/demo-bg/bg_h06.jpg',
  } as SceneLd,
  {
    /** Bad End */
    '@context': 'https://rengular.js.org/context/common.jsonld',
    id: '5',
    '@type': 'http://rengular.js.org/schema/Scene',
    createComponent: [{
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './textbox',
        '@type': 'Textbox',
        text: 'Thank you ~~ Happy RenGULAR',
        stylingTo: [{ ...STYLES.bottomText, ...{ textAlign: 'center' } }],
      } as TextboxLd,
    }, {
      '@type': 'ComponentAction',
      object: {
        '@context': 'https://rengular.js.org/context/common.jsonld',
        id: './oarsPocket',
        '@type': 'OarsPocket',
        nextScene: '/ren-db/simple-quest/1',
        prevScene: '/ren-db/simple-quest/2',
        // labels: TRANSLATION.oarsPocket,
        'OarsPocket:#labels': JSON.stringify({ skip: 'Next' }),
        stylingTo: [STYLES.oarsPocket],
      } as OarsPocketLd,
    }],
    backgroundImage: 'assets/demo-bg/cg_ki_05.png',
  } as SceneLd,
];

@Injectable({ providedIn: 'root' })
export class SimpleQuestScriptDB implements InMemoryDbService {
  createDb = () => ({
    context,
    'simple-quest': simpleQuestScenes
  })
}
