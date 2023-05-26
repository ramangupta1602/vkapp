import React from "react";
import Svg, {
  Defs,
  Path,
  RadialGradient,
  Stop,
  LinearGradient,
  G,
  Use,
  Text,
  TSpan,
  Ellipse,
  Mask,
  Circle
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title, filter */

const FullScreen = props => (
  <Svg {...props} viewBox='0 0 311 507' preserveAspectRatio='none'>
    <Defs>
      <Path
        d='M5.294 4.884l-2.905.425-.051.01a.455.455 0 00-.2.765l2.1 2.047-.495 2.891-.006.05a.455.455 0 00.666.43L7 10.135 9.597 11.5l.046.021a.455.455 0 00.614-.5L9.76 8.131l2.101-2.047.036-.038a.455.455 0 00-.287-.737l-2.905-.425-1.298-2.63a.455.455 0 00-.816 0l-1.298 2.63z'
        id='prefix__B'
      />
      <Path
        d='M63.5 382v.167c-23.196 0-42 18.953-42 42.333 0 23.146 18.43 41.954 41.305 42.328l.695.005V488c-34.794 0-63-28.43-63-63.5 0-34.72 27.645-62.93 61.958-63.491h.042V361h184v-.167c23.196 0 42-18.953 42-42.333 0-23.146-18.43-41.954-41.305-42.328l-.695-.005V276h-184v-.031c-33.868-1.065-61-29.073-61-63.469 0-34.72 27.645-62.93 61.958-63.491h.042V149h184v-.167c23.196 0 42-18.953 42-42.333 0-23.146-18.43-41.954-41.305-42.328l-.695-.005V64h-185v-.004l-.53-.004C28.018 63.456.56 36.478.007 3.026L0 2C4.877 1.317 8.572.976 11.085.976 13.239.976 16.544 1.317 21 2c0 22.487 18.408 40.798 41.305 41.162l.195.002V43h185c34.794 0 63 28.43 63 63.5 0 34.72-27.645 62.93-61.958 63.491L247.5 170h-183v.167c-23.196 0-42 18.953-42 42.333 0 23.146 18.43 41.954 41.305 42.328l.695.005V255h182c34.794 0 63 28.43 63 63.5 0 34.72-27.645 62.93-61.958 63.491L246.5 382h-183z'
        id='prefix__a'
      />
      <Path
        d='M275.425 49.563l-10.05 18.618a41.543 41.543 0 00-17.18-4.009l-.695-.005V64h-185v-.004l-.53-.004C28.018 63.456.56 36.478.007 3.026L0 2h21c0 22.487 18.408 40.798 41.305 41.162l.195.002V43h185c10.028 0 19.51 2.362 27.925 6.563z'
        id='prefix__b'
      />
      <Path
        d='M2.032 0H10a1 1 0 011 1v2a3 3 0 01-3 3H2.011a1 1 0 01-.797-1.604l1.076-1.42L1.24 1.61A1 1 0 012.031 0z'
        id='prefix__aa'
      />
      <Path
        d='M1 0h9a1 1 0 011 1v2a3 3 0 01-3 3H1a1 1 0 01-1-1V1a1 1 0 011-1z'
        id='prefix__Y'
      />
      <Path id='prefix__g' d='M10.5 0h1v19h-1z' />
      <Path
        d='M2.032 0H10a1 1 0 011 1v2a3 3 0 01-3 3H2.011a1 1 0 01-.797-1.604l1.076-1.42L1.24 1.61A1 1 0 012.031 0z'
        id='prefix__W'
      />
      <Path id='prefix__i' d='M267.5 49h1v22h-1z' />
      <Path
        d='M33 1.443l21.414 12.364a5 5 0 012.5 4.33v24.726a5 5 0 01-2.5 4.33L33 59.557a5 5 0 01-5 0L6.586 47.193a5 5 0 01-2.5-4.33V18.137a5 5 0 012.5-4.33L28 1.443a5 5 0 015 0z'
        id='prefix__U'
      />
      <Path id='prefix__k' d='M30 56h1v22h-1z' />
      <Path id='prefix__T' d='M34 56h1v22h-1z' />
      <Path
        d='M33 1.443l21.414 12.364a5 5 0 012.5 4.33v24.726a5 5 0 01-2.5 4.33L33 59.557a5 5 0 01-5 0L6.586 47.193a5 5 0 01-2.5-4.33V18.137a5 5 0 012.5-4.33L28 1.443a5 5 0 015 0z'
        id='prefix__l'
      />
      <Path
        d='M11.976 10.811l-1.742.267-.031.007c-.201.054-.274.323-.12.48l1.26 1.285-.297 1.816-.004.031c-.013.217.209.375.4.27L13 14.109l1.558.858.028.013c.193.08.405-.092.368-.314l-.298-1.816 1.261-1.285.022-.025c.131-.167.04-.43-.173-.462l-1.743-.267-.778-1.652a.267.267 0 00-.49 0l-.779 1.652z'
        id='prefix__R'
      />
      <Path
        d='M3 2h10l.03 9.922a1 1 0 01-1.621.787l-2.79-2.214a1 1 0 00-1.25.005l-2.71 2.19a1 1 0 01-1.628-.775L3 2z'
        id='prefix__o'
      />
      <Path
        d='M2.458 1.765h10l.03 9.922a1 1 0 01-1.62.787l-2.79-2.214a1 1 0 00-1.25.006l-2.71 2.189a1 1 0 01-1.63-.775l-.03-9.915z'
        id='prefix__q'
      />
      <Path
        d='M5.294 4.884l-2.905.425-.051.01a.455.455 0 00-.2.765l2.1 2.047-.495 2.891-.006.05a.455.455 0 00.666.43L7 10.135 9.597 11.5l.046.021a.455.455 0 00.614-.5L9.76 8.131l2.101-2.047.036-.038a.455.455 0 00-.287-.737l-2.905-.425-1.298-2.63a.455.455 0 00-.816 0l-1.298 2.63z'
        id='prefix__t'
      />
      <Path
        d='M3.976 10.811l-1.742.267-.031.007c-.201.054-.274.323-.12.48l1.26 1.285-.297 1.816-.004.031c-.013.217.209.375.4.27L5 14.109l1.558.858.028.013c.193.08.405-.092.368-.314l-.298-1.816 1.261-1.285.022-.025c.131-.167.04-.43-.173-.462l-1.743-.267-.778-1.652a.267.267 0 00-.49 0l-.779 1.652z'
        id='prefix__P'
      />
      <Path id='prefix__v' d='M30 56h1v22h-1z' />
      <Path
        d='M7.976 3.811l-1.742.267-.031.007c-.201.054-.274.323-.12.48l1.26 1.285-.297 1.816-.004.031c-.013.217.209.375.4.27L9 7.109l1.558.858.028.013c.193.08.405-.092.368-.314l-.298-1.816 1.261-1.285.022-.025c.131-.167.04-.43-.173-.462l-1.743-.267-.778-1.652a.267.267 0 00-.49 0l-.779 1.652z'
        id='prefix__N'
      />
      <Path
        d='M33 1.443l21.414 12.364a5 5 0 012.5 4.33v24.726a5 5 0 01-2.5 4.33L33 59.557a5 5 0 01-5 0L6.586 47.193a5 5 0 01-2.5-4.33V18.137a5 5 0 012.5-4.33L28 1.443a5 5 0 015 0z'
        id='prefix__w'
      />
      <Path
        d='M0 0h10l.03 9.922a1 1 0 01-1.621.787l-2.79-2.214a1 1 0 00-1.25.005l-2.71 2.19A1 1 0 01.03 9.915L0 0z'
        id='prefix__y'
      />
      <Path
        d='M3.914 1.927h10l.03 11.703a1 1 0 01-1.679.737L9.591 11.89a1 1 0 00-1.365.007L5.63 14.343a1 1 0 01-1.686-.725l-.03-11.691z'
        id='prefix__J'
      />
      <Path
        d='M3.634 2.14h10l.03 12.592a1 1 0 01-1.703.713L9.336 12.84a.999.999 0 00-1.414.007l-2.547 2.571a1 1 0 01-1.71-.7L3.634 2.14z'
        id='prefix__G'
      />
      <Path id='prefix__D' d='M30 56h1v22h-1z' />
      <Path
        d='M33 1.443l21.414 12.364a5 5 0 012.5 4.33v24.726a5 5 0 01-2.5 4.33L33 59.557a5 5 0 01-5 0L6.586 47.193a5 5 0 01-2.5-4.33V18.137a5 5 0 012.5-4.33L28 1.443a5 5 0 015 0z'
        id='prefix__E'
      />
      <Path
        d='M1 0h9a1 1 0 011 1v2a3 3 0 01-3 3H1a1 1 0 01-1-1V1a1 1 0 011-1z'
        id='prefix__ac'
      />
      <RadialGradient
        cx='50%'
        cy='0%'
        fx='50%'
        fy='0%'
        r='100%'
        gradientTransform='matrix(0 1 -.28571 0 .5 -.5)'
        id='prefix__e'
      >
        <Stop stopColor='#FFF' offset='0%' />
        <Stop stopColor='#EFF5F9' offset='100%' />
      </RadialGradient>
      <RadialGradient
        cx='50%'
        cy='0%'
        fx='50%'
        fy='0%'
        r='148.397%'
        gradientTransform='matrix(0 1 -.14286 0 .5 -.5)'
        id='prefix__d'
      >
        <Stop stopColor='#2CAA42' offset='0%' />
        <Stop stopColor='#43D35C' offset='100%' />
      </RadialGradient>
      <RadialGradient
        cx='50%'
        cy='50%'
        fx='50%'
        fy='50%'
        r='50.148%'
        gradientTransform='rotate(4.406 .523 .5) scale(1 1.00355)'
        id='prefix__m'
      >
        <Stop stopColor='#3E5769' offset='0%' />
        <Stop stopColor='#FFF' stopOpacity={0} offset='100%' />
      </RadialGradient>
      <LinearGradient
        x1='-16.519%'
        y1='45.524%'
        x2='128.234%'
        y2='54.752%'
        id='prefix__c'
      >
        <Stop stopColor='#86A8E7' offset='0%' />
        <Stop stopColor='#47AEE0' offset='46.426%' />
        <Stop stopColor='#91EAE4' offset='100%' />
      </LinearGradient>
    </Defs>
    <G transform='translate(.5 3)' fill='none' fillRule='evenodd'>
      <G transform='translate(0 15)'>
        <Use fill='#FFF' xlinkHref='#prefix__a' />
        <Use fill='url(#prefix__c)' fillRule='nonzero' xlinkHref='#prefix__b' />
      </G>
      <Text
        transform='translate(129.5 116)'
        fill='#8191A2'
        fontFamily='Lato-Bold, Lato'
        fontSize={12}
        fontWeight='bold'
      >
        <TSpan x={0} y={12}>
          {"FIRST MONTH"}
        </TSpan>
      </Text>
      <Text
        transform='translate(103.5 223)'
        fill='#8191A2'
        fontFamily='Lato-Bold, Lato'
        fontSize={12}
        fontWeight='bold'
      >
        <TSpan x={0} y={12}>
          {"SECOND MONTH"}
        </TSpan>
      </Text>
      <Text
        transform='translate(108.5 435)'
        fill='#8191A2'
        fontFamily='Lato-Bold, Lato'
        fontSize={12}
        fontWeight='bold'
      >
        <TSpan x={0} y={12}>
          {"TARGET WEIGHT"}
        </TSpan>
      </Text>
      <Text
        fontFamily='Lato-Bold, Lato'
        fontSize={12}
        fontWeight='bold'
        fill='#8191A2'
      >
        <TSpan x={118.5} y={339}>
          {"THIRD MONTH"}
        </TSpan>
      </Text>

      {/* Leader line */}
      <Path
        d='M10.595 20c8.149 30.205 23.982 46.205 47.5 48 35.278 2.693 156.675.239 187.5 0 30.826-.239 53.706 21.259 52.5 54-1.205 32.741-32.564 44.43-40.024 50.405-7.459 5.975-156.425-3.88-195.476 2.095-39.05 5.975-48.431 30.578-49.5 55.5-1.068 24.922 27.25 47.88 45 49.5 17.75 1.62 166.25-3.961 196.106 2.943 29.856 6.904 44.525 25.96 43.894 52.557-.63 26.597-27.68 49.035-55 51-27.32 1.965-156.726-7.14-185 0-28.273 7.14-45.485 34.902-47.5 58.707-1.343 15.87 11.49 31.744 38.5 47.623'
        stroke='#D9E5ED'
        strokeDasharray='3,9'
      />
      <Ellipse
        cx={3.5}
        cy={0.5}
        rx={3.5}
        ry={1}
        transform='translate(264.5 71)'
        fill='url(#prefix__d)'
      />
      <Ellipse fill='url(#prefix__e)' cx={11} cy={20} rx={3.5} ry={1} />
      <Use fill='#000' filter='url(#prefix__f)' xlinkHref='#prefix__g' />
      <Use fill='#FFF' xlinkHref='#prefix__g' />
      <Text fontFamily='Lato-Regular, Lato' fontSize={12} fill='#8191A2'>
        <TSpan x={173.5} y={39}>
          {"Weight: 68kg"}
        </TSpan>
      </Text>
      <Use fill='#000' filter='url(#prefix__h)' xlinkHref='#prefix__i' />
      <Use fill='#43D35C' xlinkHref='#prefix__i' />
      <Path
        d='M270.5 20.443l8.423 4.864a5 5 0 012.5 4.33v9.726a5 5 0 01-2.5 4.33l-8.423 4.864a5 5 0 01-5 0l-8.423-4.864a5 5 0 01-2.5-4.33v-9.726a5 5 0 012.5-4.33l8.423-4.864a5 5 0 015 0z'
        stroke='#F4F7FB'
        fill='#43D35C'
      />
      <Text
        fontFamily='Lato-Semibold, Lato'
        fontSize={10}
        fontWeight={500}
        fill='#FFF'
        transform='translate(252.5 19)'
      >
        <TSpan x={5} y={19}>
          {"-3kg"}
        </TSpan>
      </Text>
      <G transform='translate(34.5 199)'>
        <Ellipse fill='url(#prefix__e)' cx={30.5} cy={79} rx={3.5} ry={1} />
        <Use fill='#000' filter='url(#prefix__j)' xlinkHref='#prefix__k' />
        <Use fill='#FFF' xlinkHref='#prefix__k' />
        <Mask id='prefix__n' fill='#fff'>
          <Use xlinkHref='#prefix__l' />
        </Mask>
        <Use stroke='#D5E2EB' fill='#E0EAF1' xlinkHref='#prefix__l' />
        <Path
          d='M34.994 33.326l23.04 11.235A30.57 30.57 0 0061 31.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 27.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 7.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 44.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 55.13A29.723 29.723 0 0024.323 61l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 61a29.723 29.723 0 0012.029-5.871L33.763 34.886a4.5 4.5 0 001.231-1.56z'
          fillOpacity={0.25}
          fill='url(#prefix__m)'
          fillRule='nonzero'
          mask='url(#prefix__n)'
        />
        <Path
          d='M34.994 33.326l23.04 11.235A30.57 30.57 0 0061 31.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 27.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 7.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 44.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 55.13A29.723 29.723 0 0024.323 61l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 61a29.723 29.723 0 0012.029-5.871L33.763 34.886a4.5 4.5 0 001.231-1.56z'
          fillOpacity={0.25}
          fill='url(#prefix__m)'
          fillRule='nonzero'
          mask='url(#prefix__n)'
          transform='rotate(-24 31 31)'
        />
        <G transform='translate(17 31)'>
          <Mask id='prefix__p' fill='#fff'>
            <Use xlinkHref='#prefix__o' />
          </Mask>
          <Use
            fill='#FFF'
            transform='rotate(25 8.018 8)'
            xlinkHref='#prefix__o'
          />
          <Path
            fill='#DBD8E4'
            mask='url(#prefix__p)'
            transform='rotate(25 7 6.5)'
            d='M6 1h2v11H6z'
          />
          <Path
            fill='#DBD8E4'
            mask='url(#prefix__p)'
            transform='rotate(25 10 8.5)'
            d='M9 3h2v11H9z'
          />
        </G>
        <G transform='translate(31 31)'>
          <Mask id='prefix__r' fill='#fff'>
            <Use xlinkHref='#prefix__q' />
          </Mask>
          <Use
            fill='#FFF'
            transform='rotate(-33 7.477 7.765)'
            xlinkHref='#prefix__q'
          />
          <Path
            fill='#DBD8E4'
            mask='url(#prefix__r)'
            transform='rotate(-32 8.495 6.394)'
            d='M7.495.894h2v11h-2z'
          />
          <Path
            fill='#DBD8E4'
            mask='url(#prefix__r)'
            transform='rotate(-32 6 8.5)'
            d='M5 3h2v11H5z'
          />
        </G>
        <Circle fill='#AFC4D1' cx={31} cy={26} r={10} />
        <G fillRule='nonzero'>
          <G transform='rotate(-33 51.071 -24.234)'>
            <Use fill='#000' filter='url(#prefix__s)' xlinkHref='#prefix__t' />
            <Use fill='#FFF' xlinkHref='#prefix__t' />
          </G>
        </G>
      </G>
      <G>
        <G transform='translate(214.5 93)'>
          <Ellipse fill='url(#prefix__e)' cx={30.5} cy={79} rx={3.5} ry={1} />
          <Use fill='#000' filter='url(#prefix__u)' xlinkHref='#prefix__v' />
          <Use fill='#FFF' xlinkHref='#prefix__v' />
          <Mask id='prefix__x' fill='#fff'>
            <Use xlinkHref='#prefix__w' />
          </Mask>
          <Use stroke='#D5E2EB' fill='#E0EAF1' xlinkHref='#prefix__w' />
          <Path
            d='M34.994 33.326l23.04 11.235A30.57 30.57 0 0061 31.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 27.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 7.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 44.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 55.13A29.723 29.723 0 0024.323 61l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 61a29.723 29.723 0 0012.029-5.871L33.763 34.886a4.5 4.5 0 001.231-1.56z'
            fillOpacity={0.25}
            fill='url(#prefix__m)'
            fillRule='nonzero'
            mask='url(#prefix__x)'
          />
          <G transform='translate(26 34)'>
            <Mask id='prefix__z' fill='#fff'>
              <Use xlinkHref='#prefix__y' />
            </Mask>
            <Use fill='#FFF' xlinkHref='#prefix__y' />
            <Path fill='#D5E2EB' mask='url(#prefix__z)' d='M4 1h2v10H4z' />
          </G>
          <Circle fill='#AFC4D1' cx={31} cy={26} r={10} />
          <G fillRule='nonzero'>
            <G transform='rotate(-33 51.071 -24.234)'>
              <Use
                fill='#000'
                filter='url(#prefix__A)'
                xlinkHref='#prefix__B'
              />
              <Use fill='#FFF' xlinkHref='#prefix__B' />
            </G>
          </G>
        </G>
      </G>
      <G>
        <G transform='translate(214.5 303)'>
          <Ellipse fill='url(#prefix__e)' cx={30.5} cy={79} rx={3.5} ry={1} />
          <Use fill='#000' filter='url(#prefix__C)' xlinkHref='#prefix__D' />
          <Use fill='#FFF' xlinkHref='#prefix__D' />
          <Mask id='prefix__F' fill='#fff'>
            <Use xlinkHref='#prefix__E' />
          </Mask>
          <Use stroke='#D5E2EB' fill='#E0EAF1' xlinkHref='#prefix__E' />
          <Path
            d='M34.994 33.326l23.04 11.235A30.57 30.57 0 0061 31.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 27.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 7.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 44.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 55.13A29.723 29.723 0 0024.323 61l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 61a29.723 29.723 0 0012.029-5.871L33.763 34.886a4.5 4.5 0 001.231-1.56z'
            fillOpacity={0.25}
            fill='url(#prefix__m)'
            fillRule='nonzero'
            mask='url(#prefix__F)'
          />
          <Path
            d='M34.994 33.326l23.04 11.235A30.57 30.57 0 0061 31.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 27.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 7.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 44.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 55.13A29.723 29.723 0 0024.323 61l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 61a29.723 29.723 0 0012.029-5.871L33.763 34.886a4.5 4.5 0 001.231-1.56z'
            fillOpacity={0.25}
            fill='url(#prefix__m)'
            fillRule='nonzero'
            mask='url(#prefix__F)'
            transform='rotate(-24 31 31)'
          />
          <Path
            d='M32.5 14.866l9.99 5.768a3 3 0 011.5 2.598v11.536a3 3 0 01-1.5 2.598l-9.99 5.768a3 3 0 01-3 0l-9.99-5.768a3 3 0 01-1.5-2.598V23.232a3 3 0 011.5-2.598l9.99-5.768a3 3 0 013 0z'
            fill='#F2F9FD'
          />
          <G transform='translate(16 33)'>
            <Mask id='prefix__I' fill='#fff'>
              <Use xlinkHref='#prefix__G' />
            </Mask>
            <G transform='rotate(25 8.652 9.64)'>
              <Use
                fill='#000'
                filter='url(#prefix__H)'
                xlinkHref='#prefix__G'
              />
              <Use fill='#FFF' xlinkHref='#prefix__G' />
            </G>
            <Path
              fill='#D5E2EB'
              mask='url(#prefix__I)'
              d='M8.806 2.907l1.963.938-5.036 11.062-1.964-.938zM11.806 4.907l1.963.938-5.036 11.062-1.964-.938z'
            />
          </G>
          <G transform='translate(29 33)'>
            <Mask id='prefix__L' fill='#fff'>
              <Use xlinkHref='#prefix__J' />
            </Mask>
            <G transform='rotate(-33 8.932 8.927)'>
              <Use
                fill='#000'
                filter='url(#prefix__K)'
                xlinkHref='#prefix__J'
              />
              <Use fill='#FFF' xlinkHref='#prefix__J' />
            </G>
            <Path
              fill='#D5E2EB'
              mask='url(#prefix__L)'
              d='M6.258 2.918L8.06 1.694l6.197 10.776-1.803 1.224zM3.258 4.918L5.06 3.694l6.197 10.776-1.803 1.224z'
            />
          </G>
          <Circle fill='#AFC4D1' cx={31} cy={29} r={10} />
          <G fillRule='nonzero'>
            <G transform='rotate(-33 53.76 -22.135)'>
              <Use
                fill='#000'
                filter='url(#prefix__M)'
                xlinkHref='#prefix__N'
              />
              <Use fill='#FFF' xlinkHref='#prefix__N' />
            </G>
            <G transform='rotate(-33 49.76 -15.135)'>
              <Use
                fill='#000'
                filter='url(#prefix__O)'
                xlinkHref='#prefix__P'
              />
              <Use fill='#FFF' xlinkHref='#prefix__P' />
            </G>
            <G transform='rotate(-33 57.76 -15.135)'>
              <Use
                fill='#000'
                filter='url(#prefix__Q)'
                xlinkHref='#prefix__R'
              />
              <Use fill='#FFF' xlinkHref='#prefix__R' />
            </G>
          </G>
        </G>
      </G>
      <G>
        <G transform='translate(23.5 413)'>
          <Ellipse fill='url(#prefix__e)' cx={34.5} cy={79} rx={3.5} ry={1} />
          <Use fill='#000' filter='url(#prefix__S)' xlinkHref='#prefix__T' />
          <Use fill='#FFF' xlinkHref='#prefix__T' />
          <G transform='translate(4)'>
            <Mask id='prefix__V' fill='#fff'>
              <Use xlinkHref='#prefix__U' />
            </Mask>
            <Use stroke='#D5E2EB' fill='#E0EAF1' xlinkHref='#prefix__U' />
            <Path
              d='M34.994 36.326l23.04 11.235A30.57 30.57 0 0061 34.378H35.433a4.514 4.514 0 00-.439-1.948l23.04-11.236a30.421 30.421 0 00-8.33-10.567L33.764 30.87a4.382 4.382 0 00-1.777-.867l5.69-25.247a29.866 29.866 0 00-13.353 0l5.69 25.247c-.65.149-1.257.445-1.777.867L12.295 10.627a30.421 30.421 0 00-8.33 10.567l23.04 11.236a4.514 4.514 0 00-.438 1.948H1A30.57 30.57 0 003.965 47.56l23.04-11.235a4.5 4.5 0 001.231 1.56L12.295 58.13A29.723 29.723 0 0024.323 64l5.69-25.247c.65.151 1.324.151 1.973 0L37.676 64a29.723 29.723 0 0012.029-5.871L33.763 37.886a4.5 4.5 0 001.231-1.56z'
              fillOpacity={0.25}
              fill='url(#prefix__m)'
              fillRule='nonzero'
              mask='url(#prefix__V)'
              transform='rotate(-24 31 34)'
            />
          </G>
          <Circle
            fill='#F09EA0'
            fillRule='nonzero'
            cx={24.849}
            cy={36.833}
            r={1}
          />
          <Circle
            fill='#67D1D3'
            fillRule='nonzero'
            cx={35.861}
            cy={28.459}
            r={1}
          />
          <Path
            d='M25.36 49c-.25 0-.424-.238-.337-.462l1.283-3.314a.36.36 0 01.337-.224H29c2.533-3.11 3.433-7.021 3.743-9.737a4.248 4.248 0 01-1.11-.594l-.291-.222a12.681 12.681 0 01-1.166-1.04 9.488 9.488 0 01-6.778-2.248 9.561 9.561 0 01-3.37-7.292V21.24c0-.303.12-.588.334-.803.214-.213.498-.33.8-.33h.004l5.316.011v-1.053h-.545c-.25 0-.452-.218-.452-.487v-2.018c0-.269.203-.487.452-.487h16.55c.25 0 .452.218.452.487v2.018c0 .27-.202.487-.451.487h-.547v1.052l4.82-.01h.003c.302 0 .586.117.8.33.215.215.333.5.333.804v2.625a9.56 9.56 0 01-3.369 7.291 9.49 9.49 0 01-6.154 2.27l-.145-.002c-.444.447-.924.863-1.437 1.243l-.186.131a4.33 4.33 0 01-.877.448c.307 2.714 1.205 6.636 3.743 9.752h1.933c.147 0 .277.09.328.224l1.245 3.314a.339.339 0 01-.002.242l-.012.026a.237.237 0 01-.022.04c-.004.003-.007.008-.011.013a.343.343 0 01-.28.141l.064-.007a.375.375 0 01-.02.003L42.65 49H25.36zm-3.779-27.34v2.207a8.01 8.01 0 002.823 6.109 7.946 7.946 0 004.455 1.87 12.8 12.8 0 01-2.376-7.433l-.001-2.742-4.9-.01zm24.764.001l-4.404.01v2.742c0 2.671-.832 5.237-2.328 7.364a8.01 8.01 0 006.732-7.91V21.66z'
            fill='#AFC4D1'
          />
          <G transform='translate(0 41)'>
            <Mask id='prefix__X' fill='#fff'>
              <Use xlinkHref='#prefix__W' />
            </Mask>
            <Use fill='#8EA6B5' xlinkHref='#prefix__W' />
            <Path
              d='M6.48 3h4.91L9.715 8.073C9.308 6.44 8.833 5.271 8.291 4.57c-.543-.7-1.162-1.214-1.86-1.54'
              fill='#7C93A2'
              mask='url(#prefix__X)'
            />
          </G>
          <G transform='translate(6 39)'>
            <Mask id='prefix__Z' fill='#fff'>
              <Use xlinkHref='#prefix__Y' />
            </Mask>
            <Use fill='#A5BAC7' xlinkHref='#prefix__Y' />
            <Path
              d='M6.48 3h4.91L9.715 8.073C9.308 6.44 8.833 5.271 8.291 4.57c-.543-.7-1.162-1.214-1.86-1.54'
              fill='#8EA6B5'
              mask='url(#prefix__Z)'
            />
          </G>
          <G transform='matrix(-1 0 0 1 70 41)'>
            <Mask id='prefix__ab' fill='#fff'>
              <Use xlinkHref='#prefix__aa' />
            </Mask>
            <Use fill='#8EA6B5' xlinkHref='#prefix__aa' />
            <Path
              d='M6.48 3h4.91L9.715 8.073C9.308 6.44 8.833 5.271 8.291 4.57c-.543-.7-1.162-1.214-1.86-1.54'
              fill='#7C93A2'
              mask='url(#prefix__ab)'
            />
          </G>
          <G transform='matrix(-1 0 0 1 64 39)'>
            <Mask id='prefix__ad' fill='#fff'>
              <Use xlinkHref='#prefix__ac' />
            </Mask>
            <Use fill='#A5BAC7' xlinkHref='#prefix__ac' />
            <Path
              d='M6.48 3h4.91L9.715 8.073C9.308 6.44 8.833 5.271 8.291 4.57c-.543-.7-1.162-1.214-1.86-1.54'
              fill='#8EA6B5'
              mask='url(#prefix__ad)'
            />
          </G>
          <Path
            d='M12.898 36.461C22.442 35.487 29.631 35 34.465 35c4.844 0 12.387.489 22.63 1.467a1 1 0 01.905.995v4.092a1 1 0 01-1 1H13a1 1 0 01-1-1v-4.098a1 1 0 01.898-.995z'
            fill='#AFC4D1'
          />
          <Text
            fontFamily='Lato-Bold, Lato'
            fontSize={6}
            fontWeight='bold'
            fill='#FFF'
            transform='translate(0 35)'
          >
            <TSpan x={20} y={6}>
              {"AWESOME"}
            </TSpan>
          </Text>
          <Path
            d='M34.433 22.007l1.107 2.354a.167.167 0 00.125.096l2.476.377c.137.02.191.197.093.298l-1.792 1.832a.18.18 0 00-.048.154l.423 2.588c.023.142-.12.25-.241.184l-2.215-1.222a.16.16 0 00-.154 0l-2.215 1.222c-.122.067-.265-.042-.241-.184l.423-2.588a.18.18 0 00-.048-.154l-1.792-1.833c-.098-.1-.044-.276.092-.297l2.477-.377a.167.167 0 00.125-.096l1.107-2.354c.06-.13.237-.13.298 0z'
            fill='#FFF'
            fillRule='nonzero'
          />
        </G>
      </G>
    </G>
  </Svg>
);

export default FullScreen;
