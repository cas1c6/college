import pandas as pd
import matplotlib.pyplot as plt

# Ваши данные
data = {
    "Подгруппа (t)": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "X1": [19, 21, 20, 18, 22, 23, 24, 25, 26, 27],
    "X2": [24, 19, 16, 17, 21, 18, 19, 20, 21, 22],
    "X3": [19, 21, 20, 18, 22, 16, 17, 21, 19, 21]
}

# Создаем DataFrame
df = pd.DataFrame(data)

# Рассчитываем средние значения (X̄) и размахи (R)
df["X̄ (среднее)"] = df[["X1", "X2", "X3"]].mean(axis=1)
df["R (размах)"] = df[["X1", "X2", "X3"]].max(axis=1) - df[["X1", "X2", "X3"]].min(axis=1)

# Контрольные пределы для X̄-карты
CL_X = df["X̄ (среднее)"].mean()
UCL_X = CL_X + 1.023 * df["R (размах)"].mean()  # A2 = 1.023 для n=3
LCL_X = CL_X - 1.023 * df["R (размах)"].mean()

# Контрольные пределы для R-карты
CL_R = df["R (размах)"].mean()
UCL_R = 2.574 * CL_R  # D4 = 2.574 для n=3
LCL_R = 0  # D3 = 0 для n=3

# Создаем графики
plt.figure(figsize=(10, 5))
plt.plot(df["Подгруппа (t)"], df["X̄ (среднее)"], marker='o', label='X̄')
plt.axhline(CL_X, color='green', linestyle='--', label=f'CL ({CL_X:.2f})')
plt.axhline(UCL_X, color='red', linestyle='--', label=f'UCL ({UCL_X:.2f})')
plt.axhline(LCL_X, color='red', linestyle='--', label=f'LCL ({LCL_X:.2f})')
plt.title('X̄-карта')
plt.xlabel('Подгруппа (t)')
plt.ylabel('Среднее значение (X̄)')
plt.legend()
plt.grid()
plt.savefig('x_bar_chart.png')  # Сохраняем график как изображение

plt.figure(figsize=(10, 5))
plt.plot(df["Подгруппа (t)"], df["R (размах)"], marker='o', label='R')
plt.axhline(CL_R, color='green', linestyle='--', label=f'CL ({CL_R:.2f})')
plt.axhline(UCL_R, color='red', linestyle='--', label=f'UCL ({UCL_R:.2f})')
plt.axhline(LCL_R, color='red', linestyle='--', label=f'LCL ({LCL_R:.2f})')
plt.title('R-карта')
plt.xlabel('Подгруппа (t)')
plt.ylabel('Размах (R)')
plt.legend()
plt.grid()
plt.savefig('r_chart.png')  # Сохраняем график как изображение

# Экспорт данных и графиков в Excel
with pd.ExcelWriter('control_charts.xlsx', engine='xlsxwriter') as writer:
    # Записываем данные в лист "Данные"
    df.to_excel(writer, sheet_name='Данные', index=False)

    # Добавляем графики в Excel
    workbook = writer.book
    worksheet = writer.sheets['Данные']

    # Вставляем график X̄-карты
    worksheet.insert_image('H2', 'x_bar_chart.png')

    # Вставляем график R-карты
    worksheet.insert_image('H20', 'r_chart.png')

print("Данные и графики успешно экспортированы в control_charts.xlsx")