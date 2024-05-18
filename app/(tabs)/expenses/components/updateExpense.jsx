import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../utils/colors";
// import { RefreshControl } from "react-native";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import IconPicker from "../../../../components/modals/IconPicker";
import ColorPicker from "../../../../components/colorPicker";
import ICONS from "../../../../utils/icons";

const UpdateExpense = ({
  updateExpenseVisible,
  currentExpense,
  editableExpenseName,
  setEditableExpenseName,
  editableTotalBudgetExpense,
  setEditableTotalBudgetExpense,
  editableExpenseIcon,
  setEditableExpenseIcon,
  editableExpenseColor,
  setEditableExpenseColor,
  handleUpdateExpense,
  onClose,
}) => {
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  useEffect(() => {
    if (updateExpenseVisible) {
      setEditableExpenseName(currentExpense.name);
      setEditableTotalBudgetExpense(String(currentExpense.total_budget_expense));
    }
  }, [updateExpenseVisible, currentExpense]);

  const handleIconSelect = (icon) => {
    setEditableExpenseIcon(icon);
  };

  return (
    <Modal visible={updateExpenseVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.updateExpenseContainer}>
            <View style={styles.updateExpenseBtnContainer}>
              <TextInput
                style={styles.updateExpenseNameInput}
                placeholder="Expense name"
                placeholderTextColor={colors.DARKGRAY}
                value={editableExpenseName}
                onChangeText={setEditableExpenseName}
                autoFocus={true}
              />
              <MaterialIcons name="edit" size={24} color={colors.GRAY} />
            </View>

            <TextInput
              style={styles.updateExpenseTotalBudget}
              placeholder="Insert amount"
              placeholderTextColor={colors.DARKGRAY}
              value={editableTotalBudgetExpense}
              onChangeText={setEditableTotalBudgetExpense}
              inputMode="decimal"
              maxLength={9}
            />

            <View style={styles.appearanceContainer}>
              <View style={styles.appearanceInput}>
                <TouchableOpacity
                  style={[styles.iconPickerPreview, { backgroundColor: editableExpenseColor }]}
                  onPress={() => setIconPickerVisible(true)}
                >
                  <FontAwesome name={editableExpenseIcon} size={22} color={colors.WHITE} />
                </TouchableOpacity>

                <IconPicker
                  iconPickerVisible={iconPickerVisible}
                  icons={ICONS}
                  handleIconSelect={handleIconSelect}
                  onClose={() => setIconPickerVisible(false)}
                />
              </View>
              <View style={styles.colorPickerContainer}>
                <ColorPicker
                  selectedColor={editableExpenseColor}
                  setSelectedColor={setEditableExpenseColor}
                  height={30}
                  width={30}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleUpdateExpense}>
            <AntDesign name="check" size={34} color={colors.BLACK} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    alignItems: "center",
    marginHorizontal: "8%",
    width: "90%",

    marginVertical: "5%",
    padding: "5%",
    borderRadius: 15,
    backgroundColor: colors.WHITE,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  updateExpenseContainer: {
    width: "100%",
  },
  updateExpenseBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateExpenseNameInput: {
    width: "90%",
    fontSize: 18,
    color: colors.BLACK,
  },
  updateExpenseTotalBudget: {
    marginTop: "5%",
    paddingVertical: "5%",
    fontSize: 14,
    color: colors.BLACK,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  appearanceContainer: {
    alignItems: "center",
    marginHorizontal: "7%",
  },
  appearanceInput: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "1%",
  },

  iconPickerPreview: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    width: 50,
    height: 50,
    borderRadius: 37.5,
  },
  colorPickerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
  addBtnText: {
    fontSize: 20,
    color: colors.BLACK,
  },
});

export default UpdateExpense;
