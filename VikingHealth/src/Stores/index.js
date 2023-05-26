import { UserAccountStore } from "./UserAccountStore";
import { LoginUserStore } from "./LoginUserStore";
import { MeasurementUnitStore } from "./MeasurementUnitStore";
import { GamificationStore } from "./GamificationStore";
import { RewardStore } from "./RewardStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "mobx-persist";

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

const measurementUnitStore = new MeasurementUnitStore();
const loginUserStore = new LoginUserStore();
const userAccountStore = new UserAccountStore(loginUserStore);
const gamificationStore = new GamificationStore();
const rewardStore = new RewardStore(userAccountStore);

export const stores = {
  userAccountStore,
  loginUserStore,
  measurementUnitStore,
  gamificationStore,
  rewardStore,
};

hydrate("measurementUnitStore", measurementUnitStore);
hydrate("loginUserStore", loginUserStore);
hydrate("userAccountStore", userAccountStore);
hydrate("gamificationStore", gamificationStore);
hydrate("rewardStore", rewardStore);
