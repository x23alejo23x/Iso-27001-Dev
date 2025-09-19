import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userInfoReducer from "../slices/userInfoSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userInfoState"],
};

const rootReducer = combineReducers({
  userInfoState: userInfoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
