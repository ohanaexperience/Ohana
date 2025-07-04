import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuthStore } from "../store/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import KeyboardAwareScreen from "../../components/KeyboardAwareScreen";
import { useExperienceStore } from "../store/experience";

import { BACKEND_URL } from "../env";
import { COLORS } from "@/constants/theme";

export default function CreateExperienceStep1() {
  const router = useRouter();
  const navigation = useNavigation();
  const accessToken = useAuthStore((s) => s.user?.tokens.idToken);
  const { step1, setStep1 } = useExperienceStore();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Thai", value: "thai" },
    { label: "Japanese", value: "japanese" },
  ];

  const [experienceType, setExperienceType] = useState<
    "indoor" | "outdoor" | "both" | null
  >(null);
  const [formErrors, setFormErrors] = useState<{ message: string } | null>(
    null
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Experience",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(BACKEND_URL + "/v1/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        console.log("Fetched categories:", data);
        setCategories(
          data.map((cat: any) => ({
            label: cat.name,
            value: cat.id,
            subCategories: cat.subCategories,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    if (accessToken) fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    const selected = categories.find((c: any) => c.value === category);
    if (selected) {
      setSubCategories(
        selected.subCategories.map((sub: any) => ({
          label: sub.name,
          value: sub.id,
        }))
      );
    } else {
      setSubCategories([]);
    }
  }, [category]);

  useEffect(() => {
    setStep1({
      title,
      tagline,
      description,
      category:
        category && subCategory
          ? { mainId: category, subId: subCategory }
          : undefined,
      languages,
      experienceType,
    });
  }, [
    title,
    tagline,
    description,
    category,
    subCategory,
    languages,
    experienceType,
  ]);

  const handleContinue = () => {
    if (!title.trim())
      return setFormErrors({ message: "Please enter a title." });
    if (!tagline.trim())
      return setFormErrors({ message: "Please enter a tagline." });
    if (!category)
      return setFormErrors({ message: "Please select a category." });
    if (!subCategory)
      return setFormErrors({ message: "Please select a sub-category." });
    if (languages.length === 0)
      return setFormErrors({ message: "Please select at least one language." });
    if (!experienceType)
      return setFormErrors({ message: "Please choose an experience type." });
    if (description.trim().length < 10 || description.trim().length > 1000) {
      return setFormErrors({
        message: "Description must be between 10 and 1000 characters.",
      });
    }

    setFormErrors(null);
    router.push("./step2");
  };
  console.log("step1", step1);
  return (
    <KeyboardAwareScreen>
      <Text style={styles.stepText}>Step 1 of 7</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "14%" }]} />
      </View>

      <Text style={styles.title}>The Basics</Text>
      <Text style={styles.subtitle}>
        Let's start with the fundamental details of your experience
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Experience Title*"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={COLORS.placeholder}
      />

      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Short Tagline*"
        multiline
        maxLength={150}
        value={tagline}
        onChangeText={setTagline}
        placeholderTextColor={COLORS.placeholder}
      />

      <DropDownPicker
        open={categoryOpen}
        value={category}
        items={categories}
        setOpen={setCategoryOpen}
        setValue={(val) => {
          setCategory(val);
          setSubCategory(null);
        }}
        setItems={setCategories}
        placeholder="Select category*"
        style={styles.dropdown}
        containerStyle={{ marginBottom: 16 }}
        zIndex={3000}
        zIndexInverse={1000}
        listMode="SCROLLVIEW"
      />

      <DropDownPicker
        open={subCategoryOpen}
        value={subCategory}
        items={subCategories}
        setOpen={setSubCategoryOpen}
        setValue={setSubCategory}
        setItems={setSubCategories}
        placeholder="Select sub-category*"
        style={[
          styles.dropdown,
          { backgroundColor: category ? "#fff" : "#f5f5f5" },
        ]}
        containerStyle={{ marginBottom: 16 }}
        zIndex={2000}
        zIndexInverse={2000}
        listMode="SCROLLVIEW"
        disabled={!category}
      />

      <DropDownPicker
        open={languagesOpen}
        value={languages}
        items={languageOptions}
        setOpen={setLanguagesOpen}
        setValue={setLanguages}
        multiple
        min={0}
        max={3}
        placeholder="Languages Spoken*"
        style={styles.dropdown}
        containerStyle={{ marginBottom: 16 }}
        zIndex={1500}
        zIndexInverse={1500}
        listMode="SCROLLVIEW"
      />

      <Text style={styles.label}>Experience Type*</Text>
      <View style={styles.typeRow}>
        {["indoor", "outdoor", "both"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              experienceType === type && { backgroundColor: "#333" },
            ]}
            onPress={() => setExperienceType(type as any)}
          >
            <MaterialCommunityIcons
              name={
                type === "indoor"
                  ? "home-outline"
                  : type === "outdoor"
                  ? "pine-tree"
                  : "home-group"
              }
              size={24}
              color={experienceType === type ? "#fff" : "#000"}
            />
            <Text
              style={[
                styles.typeText,
                experienceType === type && { color: "#fff" },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: "top" }]}
        placeholder="Full Description*"
        multiline
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={COLORS.placeholder}
      />
      {formErrors?.message ? (
        <Text style={{ color: "red", marginTop: 8, textAlign: "center" }}>
          {formErrors.message}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue to Step 2</Text>
      </TouchableOpacity>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  stepText: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  progressBar: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 6,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  typeText: { fontSize: 14, fontWeight: "500", marginTop: 4 },
});
