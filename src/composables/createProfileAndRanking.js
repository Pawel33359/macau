import useSetCollection from "@/composables/use/useSetCollection";
import getUser from "@/composables/get/getUser";

const createProfileAndRanking = async () => {
  const { user } = getUser();
  const profilePromise = createProfile(user);
  const rankingPromise = createRanking(user);

  await Promise.all[(profilePromise, rankingPromise)];
};

const createProfile = (user) => {
  const { setDoc } = useSetCollection("user_profile", user.value.uid);
  const profile = {
    icon: require("@/assets/icons/1.png"),
    description: "",
    won: 0,
    lost: 0,
    createdAt: user.value.metadata.creationTime,
    name: user.value.displayName,
  };
  return setDoc(profile);
};
const createRanking = (user) => {
  const { setDoc } = useSetCollection("user_ranking", user.value.uid);
  const ranking = {
    ranking_won: 0,
    ranking_lost: 0,
    points: 100,
  };
  return setDoc(ranking);
};

export default createProfileAndRanking;
