import { strings } from '../../utility/locales/i18n';
import { R } from 'Resources';

export const MOODS = {
  5: {
    name: strings('days_performance.performance5'),
    icon: R.Images.excellent,
    color: '#91dd66',
    encouragementMessage: 'Great!'
  },
  4: {
    name: strings('days_performance.performance4'),
    icon: R.Images.good,
    color: '#00ccb9',
    encouragementMessage: 'Great!'
  },
  3: {
    name: strings('days_performance.performance3'),
    icon: R.Images.okay,
    color: '#ffc242',
    encouragementMessage: "Don't give up!"
  },
  2: {
    name: strings('days_performance.performance2'),
    icon: R.Images.poor,
    color: '#ff842f',
    encouragementMessage: "Don't give up!"
  },
  1: {
    name: strings('days_performance.performance1'),
    icon: R.Images.bad,
    color: '#ff5462',
    encouragementMessage: "Don't give up!"
  }
};
