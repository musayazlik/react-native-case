import { StyleSheet } from "react-native";

// Posts İndex Styles
const postsIndexStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,

    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },

  filterWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    gap: 20,
    justifyContent: "space-between",
  },
});

// Posts Detail Styles
const postsDetailStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600", // "semibold" yerine kullanılır
    backgroundColor: "#e11d48",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  categoryContainer: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e11d48",
    marginTop: 10,
    borderRadius: 4,
    borderStartColor: "#9f1239",
    borderStartWidth: 4,
    borderEndColor: "#9f1239",
    borderEndWidth: 4,
  },
  category: {
    fontSize: 18,
    paddingVertical: 5,
    fontWeight: "bold",
    color: "white",
  },
  date: {
    fontSize: 14,
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "$text",
    padding: 10,
  },
});

// Posts Create Styles
const postsCreateStyles = StyleSheet.create({
  imageWrapper: {
    marginBottom: 0,
    marginTop: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  formButtonWrapper: {
    marginTop: 20,
  },
});

export { postsIndexStyles, postsCreateStyles, postsDetailStyles };
