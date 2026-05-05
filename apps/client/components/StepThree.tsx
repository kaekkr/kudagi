import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { Ruler } from "lucide-react-native";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { Checkbox } from "./ui/Checkbox";
import { validateDate } from "@/hooks/useOrderFormLogic";
import { OCCASIONS_T, DELIVERY_METHODS_T, Lang } from "@/constants/translations";
import { KU_GOLD } from "@/constants/orderConstants";

interface StepThreeProps {
  t: any;
  control: Control<any>;
  lang: Lang;
}

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += ".";
    result += digits[i];
  }
  return result;
}

function applyNumericMask(raw: string): string {
  return raw.replace(/\D/g, "").substring(0, 5);
}

const getMeasurementFields = (lang: Lang) => [
  { name: "chest",             abbr: "Ог",     label: lang === "kaz" ? "Кеуде өлшемі"     : "Обхват груди" },
  { name: "waist",             abbr: "От",     label: lang === "kaz" ? "Бел өлшемі"        : "Обхват талии" },
  { name: "hips",              abbr: "Об",     label: lang === "kaz" ? "Жамбас өлшемі"     : "Обхват бедер" },
  { name: "chestHeight",       abbr: "Вг",     label: lang === "kaz" ? "Кеуде биіктігі"    : "Высота груди" },
  { name: "backWidth",         abbr: "Шсп",    label: lang === "kaz" ? "Арқа ені"          : "Ширина спинки" },
  { name: "frontLength",       abbr: "Дтп",    label: lang === "kaz" ? "Алдыңғы ұзындық"  : "Длина полочки" },
  { name: "backLength",        abbr: "Дтс",    label: lang === "kaz" ? "Арқа ұзындығы"    : "Длина спинки" },
  { name: "shoulderLength",    abbr: "Дплеча", label: lang === "kaz" ? "Иық ұзындығы"     : "Длина плеча" },
  { name: "skirtLength",       abbr: "Дю",     label: lang === "kaz" ? "Юбка ұзындығы"    : "Длина юбки" },
  { name: "garmentLength",     abbr: "Дизд",   label: lang === "kaz" ? "Бұйым ұзындығы"   : "Длина изделия" },
  { name: "armCircumference",  abbr: "Орук",   label: lang === "kaz" ? "Қол өлшемі"       : "Обхват руки" },
  { name: "sleeveLength",      abbr: "Д рук",  label: lang === "kaz" ? "Жең ұзындығы"     : "Длина рукавов" },
  { name: "neckCircumference", abbr: "Шея",    label: lang === "kaz" ? "Мойын өлшемі"     : "Обхват шеи" },
  { name: "height",            abbr: "Бой",    label: lang === "kaz" ? "Бойы"              : "Рост" },
];

/** Single measurement field */
const MeasurementInput = ({
  control,
  fieldName,
  abbr,
  label,
}: {
  control: Control<any>;
  fieldName: string;
  abbr: string;
  label: string;
}) => (
  <View style={{ width: "48%", marginBottom: 12 }}>
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
      <View style={{
        backgroundColor: KU_GOLD, borderRadius: 6,
        paddingHorizontal: 6, paddingVertical: 2, marginRight: 6,
      }}>
        <Text style={{ color: "white", fontSize: 9, fontWeight: "700" }}>{abbr}</Text>
      </View>
      <Text style={{ fontSize: 11, color: "#6B7280", flex: 1 }} numberOfLines={1}>{label}</Text>
    </View>
    <Controller
      control={control}
      name={fieldName as any}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={{
            backgroundColor: "white", borderWidth: 1, borderColor: "#F3F4F6",
            padding: 12, borderRadius: 12, color: "#1F2937", fontSize: 14,
          }}
          placeholder="0"
          placeholderTextColor="#C1C1C1"
          value={value}
          onChangeText={(text) => onChange(applyNumericMask(text))}
          keyboardType="numeric"
          maxLength={5}
        />
      )}
    />
  </View>
);

/** Full measurement grid for standard order */
const StandardMeasurements = ({ control, lang, t }: { control: Control<any>; lang: Lang; t: any }) => {
  const method = useWatch({ control, name: "measurementMethod", defaultValue: "самостоятельно" });
  const fields = getMeasurementFields(lang);

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ruler size={18} color={KU_GOLD} />
        <Text style={{ marginLeft: 8, fontWeight: "600", color: "#1F2937" }}>{t.measurements}</Text>
      </View>

      <Controller
        control={control}
        name="measurementMethod"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            {[
              { value: "самостоятельно", label: t.selfMeasure },
              { value: "мастер",         label: t.masterMeasure },
            ].map((m) => (
              <Pressable key={m.value} onPress={() => onChange(m.value)} style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}>
                <View style={{
                  width: 16, height: 16, borderRadius: 8, borderWidth: 1.5,
                  borderColor: value === m.value ? KU_GOLD : "#D1D5DB",
                  backgroundColor: value === m.value ? KU_GOLD : "transparent",
                  marginRight: 8,
                }} />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      {method === "самостоятельно" && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 8 }}>
          {fields.map((f) => (
            <MeasurementInput key={f.name} control={control} fieldName={f.name} abbr={f.abbr} label={f.label} />
          ))}
        </View>
      )}
    </View>
  );
};

/** Measurement grid for one person in a paired order */
const PairedPersonMeasurements = ({
  control, lang, t, prefix, personLabel,
}: {
  control: Control<any>;
  lang: Lang;
  t: any;
  prefix: "p1" | "p2";
  personLabel: string;
}) => {
  const fields = getMeasurementFields(lang);

  return (
    <View style={{
      borderWidth: 1, borderColor: "#E5E7EB",
      borderRadius: 16, padding: 14, marginBottom: 16,
    }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View style={{
          backgroundColor: KU_GOLD, borderRadius: 8,
          paddingHorizontal: 10, paddingVertical: 4, marginRight: 8,
        }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
            {prefix === "p1" ? "1" : "2"}
          </Text>
        </View>
        <Text style={{ fontWeight: "600", color: "#374151", fontSize: 15 }}>{personLabel}</Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {fields.map((f) => (
          <MeasurementInput
            key={f.name}
            control={control}
            fieldName={`${prefix}Measurements.${f.name}`}
            abbr={f.abbr}
            label={f.label}
          />
        ))}
      </View>
    </View>
  );
};

export const StepThree = ({ t, control, lang }: StepThreeProps) => {
  const orderType = useWatch({ control, name: "orderType", defaultValue: "Стандартный" });
  const isPaired  = orderType === "Парный";

  return (
    <View>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 4 }}>{t.newOrder}</Text>
      <Text style={{ color: "#9CA3AF", marginBottom: 24 }}>{t.step3title}</Text>

      {/* ── Measurements ── */}
      {isPaired ? (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Ruler size={18} color={KU_GOLD} />
            <Text style={{ marginLeft: 8, fontWeight: "600", color: "#1F2937" }}>{t.measurements}</Text>
          </View>
          <PairedPersonMeasurements
            control={control} lang={lang} t={t} prefix="p1"
            personLabel={lang === "kaz" ? "1-ші адам" : "Человек 1"}
          />
          <PairedPersonMeasurements
            control={control} lang={lang} t={t} prefix="p2"
            personLabel={lang === "kaz" ? "2-ші адам" : "Человек 2"}
          />
        </View>
      ) : (
        <StandardMeasurements control={control} lang={lang} t={t} />
      )}

      {/* ── Occasion ── */}
      <SectionLabel>{t.occasion}</SectionLabel>
      <ChipSelector control={control} name="occasion" options={OCCASIONS_T[lang]} />

      {/* ── Desired date ── */}
      <SectionLabel>{t.desiredDate}</SectionLabel>
      <Controller
        control={control}
        name="desiredDate"
        rules={{
          required: t.errorDate,
          validate: (value) => {
            const result = validateDate(value);
            return result === true ? true : result;
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: error ? "#FCA5A5" : "#F3F4F6",
                padding: 16, borderRadius: 12, color: "#1F2937",
              }}
              placeholder={lang === "kaz" ? "кк.аа.жжжж" : "дд.мм.гггг"}
              placeholderTextColor="#C1C1C1"
              value={value}
              onChangeText={(text) => onChange(applyDateMask(text))}
              keyboardType="numeric"
              maxLength={10}
            />
            {error && <Text style={{ color: "#F87171", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{error.message}</Text>}
          </View>
        )}
      />

      <Checkbox control={control} name="deadlineConfirmed" text={t.confirmDeadline} rules={{ required: t.errorDeadline }} />

      {/* ── Delivery ── */}
      <SectionLabel>{t.deliveryMethod}</SectionLabel>
      <ChipSelector control={control} name="deliveryMethod" options={DELIVERY_METHODS_T[lang]} />

      {/* ── Comment ── */}
      <SectionLabel>{t.comment}</SectionLabel>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{
              backgroundColor: "white", borderWidth: 1, borderColor: "#F3F4F6",
              padding: 16, borderRadius: 12, color: "#1F2937",
              minHeight: 80, textAlignVertical: "top", marginBottom: 12,
            }}
            placeholder={t.commentPlaceholder}
            placeholderTextColor="#C1C1C1"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <Checkbox control={control} name="confirmData" text={t.confirmData} rules={{ required: t.errorConfirmData }} />
    </View>
  );
};
