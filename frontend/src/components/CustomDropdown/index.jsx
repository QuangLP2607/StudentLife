import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CustomDropdown.module.scss";

const cx = classNames.bind(styles);

const CustomDropdown = ({ options, selectedValue, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel = selectedValue
    ? options.find((option) => option.value === selectedValue)?.label
    : placeholder;

  return (
    <div
      className={cx("dropdown")}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
    >
      <div className={cx("dropdown__button")} onClick={handleToggleDropdown}>
        {selectedLabel}
      </div>
      {isOpen && (
        <ul className={cx("dropdown__list")}>
          {options.map((option) => (
            <li
              key={option.value}
              className={cx("dropdown__item", {
                selected: option.value === selectedValue,
              })}
              onClick={() => handleSelectOption(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
