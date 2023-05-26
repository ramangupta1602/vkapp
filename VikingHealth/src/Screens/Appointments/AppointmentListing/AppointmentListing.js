import React, { Component } from 'react';
import {
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppointmentListingContainer from './AppointmentListingContainer';
import { BackButton, FloatingButton } from '../../../Components';
import ToolTipComponent, {
  Alignment,
} from '../../../Components/ToolTipComponent/ToolTipComponent';
import Styles from './styles';
import CommonStyles from '../styles';
import { AppointmentListingTab, TabsName } from '../Components';
import { R } from '../../../Resources/R';
import ScreenNameConstant from '../../ScreenNameConstant';
import { inject, observer } from 'mobx-react';
import { USER_TYPE } from '../../../Library/Constants';
import * as AppointmentQueries from '../../../AppSyncQueries/AppointmentQueries';
import { Query } from 'react-apollo';
import {
  AsyncStoreKeys,
  saveDataWithKey,
  getDataWithKey,
} from '../../../utility/AsyncStoreUtil';
import { strings } from '../../../utility/locales/i18n';

const { width, height } = Dimensions.get('screen');

@inject('userAccountStore', 'loginUserStore')
@observer
export default class PatientAppointmentListingComponent extends Component {
  constructor(props) {
    super(props);

    const selectedTab = props.navigation.getParam(
      'selectedTab',
      TabsName.Upcoming
    );
    this.highlight = props.navigation.getParam('appointmentId', '');

    this.state = {
      selectedTab: selectedTab,
      animation: new Animated.Value(selectedTab),
      showTooltip: !this.props.userAccountStore.hasShownAppointmentGuidelinePopup,
      appointmentCount: {
        UPCOMING: -1,
        PENDING: -1,
        COMPLETED: -1,
      },
    };
  }

  onTabChange = (selectedTab) => {
    this.setState({ selectedTab });
    this.animatedToValue(selectedTab);

    if (this.scrollRef) {
      this.scrollRef.scrollTo({ x: selectedTab * width, y: 0, animated: true });
    }
  };

  animatedToValue = (toValue) => {
    const { animation } = this.state;

    Animated.timing(animation, {
      toValue,
      duration: 400,
    }).start();
  };

  getTranslationStyle = () => {
    const { animation } = this.state;

    const translationInterpolation = animation.interpolate({
      inputRange: [0, 2],
      outputRange: [0, -2 * width],
    });

    return {
      transform: [
        {
          translateX: translationInterpolation,
        },
      ],
    };
  };

  refreshList = () => {
    this.setState({});
  };

  async componentDidMount() {
    const { selectedTab } = this.state;

    setTimeout(() => {
      if (this.scrollRef) {
        this.scrollRef.scrollTo({
          x: selectedTab * width,
          y: 0,
          animated: false,
        });
      }
    }, 200);

    const appointmentCount = await getDataWithKey(
      AsyncStoreKeys.APPOINTMENT_COUNT,
      {
        UPCOMING: -1,
        PENDING: -1,
        COMPLETED: -1,
      }
    );

    this.setState({ appointmentCount });
  }

  parseCountData = (data) => {
    let countData = {
      UPCOMING: -1,
      PENDING: -1,
      COMPLETED: -1,
    };

    if (data && data.getAppointmentCategoryCount) {
      const counts = JSON.parse(data.getAppointmentCategoryCount);

      const {
        result: { UPCOMING = 0, PENDING = 0, COMPLETED = 0 },
      } = JSON.parse(counts.body);

      countData = {
        UPCOMING,
        PENDING,
        COMPLETED,
      };
    }

    return countData;
  };

  onInfoIconTooltipPressed = () => {
    this.props.userAccountStore.setAppointmentGuidelineShown();
    this.setState({
      showTooltip: false
    })
    this.navigateToAppointmentGuideline();
  };

  navigateToAppointmentGuideline = () => {
    this.props.navigation.navigate(ScreenNameConstant.AppointmentGuideline);
  };

  render() {
    const { selectedTab, appointmentCount } = this.state;
    const { navigation } = this.props;

    const { userType } = this.props.loginUserStore;
    const { username } = this.props.userAccountStore;
    const isAdmin = userType === USER_TYPE.ADMIN;

    return (
      <View style={Styles.containerStyle}>
        <View style={{ paddingHorizontal: 16, paddingTop: 40, marginLeft: -8 }}>
          <BackButton navigation={this.props.navigation} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 5,
            }}
          >
            <Text style={Styles.titleStyle}>Appointments</Text>

            <TouchableOpacity
              hitSlop={{
                top: 10,
                bottom: 10,
                right: 10,
                left: 10,
                marginBottom: -10,
              }}
              onPress={this.navigateToAppointmentGuideline}
              style={[Styles.infoIconStyle, { marginRight: 4 }]}
            >
              <ToolTipComponent
                horizontalAlignment={Alignment.RIGHT}
                verticalAlignment={Alignment.TOP}
                shouldShowPopup={this.state.showTooltip
                  //!this.props.userAccountStore.hasShownAppointmentGuidelinePopup
                }
                message={strings('appointment.checkAppointmentGuideLine')}
                onPress={this.onInfoIconTooltipPressed}
                onHide={this.navigateToAppointmentGuideline}
              >
                <Image
                  source={R.Images.info}
                  style={{
                    width: 30,
                    height: 30,
                    marginBottom: 10,
                    tintColor: '#282727',
                  }}
                  resizeMode='contain'
                />
              </ToolTipComponent>
            </TouchableOpacity>
          </View>
        </View>

        <Query
          query={AppointmentQueries.GetAppointmentsCount}
          variables={{
            appointmentDetails: JSON.stringify({
              appointment: {
                statusCategory: ['UPCOMING', 'PENDING', 'COMPLETED'],
                patientId: isAdmin ? null : username,
              },
            }),
          }}
          onCompleted={(data) => {
            const countData = this.parseCountData(data);

            saveDataWithKey(countData, AsyncStoreKeys.APPOINTMENT_COUNT);
          }}
          fetchPolicy='cache-and-network'
        >
          {({ data }) => {
            const countData = this.parseCountData(data);

            return (
              <AppointmentListingTab
                style={{ marginTop: 16 }}
                selectedTab={selectedTab}
                onTabChange={this.onTabChange}
                currentCount={countData}
                previousCount={appointmentCount}
              />
            );
          }}
        </Query>

        <ScrollView
          ref={(ref) => {
            this.scrollRef = ref;
          }}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        >
          <AppointmentListingContainer
            navigation={navigation}
            listType={'UPCOMING'}
            refreshList={this.refreshList}
            changeTab={this.onTabChange}
            highlight={this.highlight}
          />
          <AppointmentListingContainer
            navigation={navigation}
            listType={'PENDING'}
            refreshList={this.refreshList}
            changeTab={this.onTabChange}
            highlight={this.highlight}
          />
          <AppointmentListingContainer
            navigation={navigation}
            listType={'COMPLETED'}
            refreshList={this.refreshList}
            changeTab={this.onTabChange}
            highlight={this.highlight}
          />
        </ScrollView>

        {isAdmin && (
          <FloatingButton
            onClick={() => {
              this.props.navigation.navigate(ScreenNameConstant.SearchPatient);
            }}
            image={R.Images.AppointmentImages.AppointmentFloatingIcon}
          />
        )}
      </View>
    );
  }
}
