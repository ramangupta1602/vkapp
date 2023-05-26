import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Use,
} from 'react-native-svg';

function StartSymbol(props) {
  return (
    <Svg width={24} height={24} viewBox='0 0 24 24' {...props}>
      <Defs>
        <LinearGradient
          x1='81.731%'
          y1='19.296%'
          x2='22.452%'
          y2='100%'
          id='prefix__c'
        >
          <Stop stopColor='#DCEDFF' offset='0%' />
          <Stop stopColor='#FFF' offset='100%' />
        </LinearGradient>
        <Circle id='prefix__b' cx={12} cy={12} r={4} />
      </Defs>
      <G fill='none' fillRule='evenodd'>
        <Circle fill='#1072E0' cx={12} cy={12} r={12} />
        <Use fill='#000' filter='url(#prefix__a)' xlinkHref='#prefix__b' />
        <Use fill='url(#prefix__c)' xlinkHref='#prefix__b' />
      </G>
    </Svg>
  );
}

export default StartSymbol;
