export interface DefaultProps {
  children?: React.ReactNode;
}
export interface DefaultPropsI18n extends DefaultProps {
  locale: string;
}

export interface DefaultPropsI18nRoot extends DefaultProps {
  params: {
    locale: string;
  };
}
