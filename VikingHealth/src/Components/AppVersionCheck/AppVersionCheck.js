import { Platform, Linking } from "react-native";
import VersionNumber from "react-native-version-number";
import * as AppVersionQueries from "../../AppSyncQueries/UserQueries";
import { appsyncClient } from "../../../App";
import { checkInternetConnection } from "react-native-offline";

class Version {
  constructor() {
    this.majorVersion = 0;
    this.minorVersion = 0;
    this.buildVersion = 0;
    this.controlVersion = 0;
  }
}

export default class AppVersoning {
  constructor(userAccountStore, loginUserStore) {
    this.userAccountStore = userAccountStore;
    this.loginUserStore = loginUserStore;

    this.localAppVersion = new Version();
    this.remoteAppVersion = new Version();
  }

  getLocalAppVersion = () => {
    const appVersion = VersionNumber.appVersion.split(".");
    const buildVersion = VersionNumber.buildVersion;

    this.localAppVersion.majorVersion = parseInt(appVersion[0]) || 0;
    this.localAppVersion.minorVersion = parseInt(appVersion[1]) || 0;
    this.localAppVersion.buildVersion = parseInt(buildVersion) || 0;

    // In android we specify build no as human readable string
    if (Platform.OS === "android") {
      this.localAppVersion.majorVersion = parseInt(appVersion[0]) || 0;
      this.localAppVersion.minorVersion = parseInt(appVersion[1]) || 0;
      this.localAppVersion.buildVersion = parseInt(appVersion[2]) || 0;
    }
  };

  checkAppVersion = async () => {
    await this.getRemoteAppVersion();
    this.getLocalAppVersion();

    const shouldShowUpdateAlert = this.compareVersion();

    const isPromptShown = this.isPromptShowForVersion();

    if (shouldShowUpdateAlert && !isPromptShown) {
      this.userAccountStore.setShowUpdateAvailableCard(true);

      this.updateLastPromptInUserStore();
    }
  };

  compareVersion = () => {
    if (this.checkMajorVersion()) {
      return true;
    }

    if (this.checkMinorVersion()) {
      return true;
    }

    if (this.checkBuildVersion()) {
      return true;
    }

    return false;
  };

  checkMajorVersion = () => {
    return (
      this.remoteAppVersion.majorVersion > this.localAppVersion.majorVersion
    );
  };

  checkMinorVersion = () => {
    return (
      this.remoteAppVersion.majorVersion ===
        this.localAppVersion.majorVersion &&
      this.remoteAppVersion.minorVersion > this.localAppVersion.minorVersion
    );
  };

  checkBuildVersion = () => {
    return (
      this.remoteAppVersion.majorVersion ===
        this.localAppVersion.majorVersion &&
      this.remoteAppVersion.minorVersion ===
        this.localAppVersion.minorVersion &&
      this.remoteAppVersion.buildVersion > this.localAppVersion.buildVersion
    );
  };

  isPromptShowForVersion = () => {
    const storeAppVersion = this.userAccountStore.lastPromptShownForVersion;
    const currentRemoteVersion = this.getRemotAppVersionString();

    if (storeAppVersion === currentRemoteVersion) {
      return true;
    }

    return false;
  };
  s;

  getRemoteAppVersion = async () => {
    const res = await appsyncClient.query({
      query: AppVersionQueries.AppVersion,
      fetchPolicy: "network-only",
    });

    // const res = null;

    const appVersion = res.data.getAppVersion;
    const { major = 0, minor = 0, build = 0, control = 0 } = appVersion;

    this.remoteAppVersion.majorVersion = major;
    this.remoteAppVersion.minorVersion = minor;
    this.remoteAppVersion.buildVersion = build;
    this.remoteAppVersion.control = control;
  };

  updateLastPromptInUserStore = () => {
    const appVersion = this.getRemotAppVersionString();
    this.userAccountStore.setLastPromptVersion(appVersion);
  };

  getAppVersionString = (majorVersion, minorVersion, buildVersion) => {
    const appVersion = `${majorVersion}.${minorVersion}.${buildVersion}`;
    return appVersion;
  };

  // have to refactor this methods..
  getRemotAppVersionString = () => {
    const majorVersion = this.remoteAppVersion.majorVersion;
    const minorVersion = this.remoteAppVersion.minorVersion;
    const buildVersion = this.remoteAppVersion.buildVersion;

    const appVersion = this.getAppVersionString(
      majorVersion,
      minorVersion,
      buildVersion
    );
    return appVersion;
  };

  getLocalAppVersionString = () => {
    this.getLocalAppVersion();

    const majorVersion = this.localAppVersion.majorVersion;
    const minorVersion = this.localAppVersion.minorVersion;
    const buildVersion = this.localAppVersion.buildVersion;

    const appVersion = this.getAppVersionString(
      majorVersion,
      minorVersion,
      buildVersion
    );
    return appVersion;
  };

  goToStore() {
    if (Platform.OS === "ios") {
      Linking.openURL(
        "https://apps.apple.com/us/app/viking-health/id1456404647"
      );
    } else {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.vikinghealth&hl=en"
      );
    }
  }

  // Mutation to update Patient app version on the server. Not currently used as it is presenting
  // a lot of bugs.
  updateSyncedAppVersionOnServer = () => {
    this.getLocalAppVersion();
    const appVersion = this.getLocalAppVersionString();

    if (this.userAccountStore.lastVersionSynced === appVersion) {
      // App version is already synced on the server , no need to upload..
      return;
    }

    checkInternetConnection().then((isConnected) => {
      if (isConnected === true) {
        this.updateServer();
      }
    });
  };

  updateServer = () => {
    const { userId } = this.loginUserStore;
    const appVersion = this.getLocalAppVersionString();
    const deviceType = Platform.OS;
    const controlVersion = 0;

    appsyncClient
      .mutate({
        mutation: AppVersionQueries.UpdateUserAppVersion,
        variables: { userId, appVersion, controlVersion, deviceType },
      })
      .then(() => {
        this.userAccountStore.setLastSyncedVersion(appVersion);
      });
  };
}
