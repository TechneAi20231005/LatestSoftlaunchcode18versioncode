export const ALPHA_NUMERIC_REGEX =
  /^(?=.*[a-zA-Z])(?=.*[0-9]?)[a-zA-Z0-9\s!@#$%^&*()_+[\]{};':"\\|,.<>/?-]*$/;
export const ONLY_CHARACTER_REGEX = /^[a-zA-Z\s]+$/;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
export const SPECIAL_CHARACTER_REGEX =
  /^[a-zA-Z0-9\s\-_\@\!\#\$\%\^\&\*\(\)\+\=\[\]\{\}\|\;\:\'\"\,\<\>\.\?\/\`~]+$/;
export const UNDERSCORE_SPACE_SLASH_REGEX = /^[a-zA-Z\s_\/]+$/;
