import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, 'employee_dataset.csv')

# Define realistic data distributions
departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Engineering', 
               'Customer Service', 'Legal', 'R&D', 'Product Management', 'Data Science']

positions = ['Intern', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 
             'Senior Manager', 'Director', 'Senior Director', 'VP', 'Senior VP', 'C-Level']

education_levels = ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'MBA']

locations = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 
             'Chicago', 'Los Angeles', 'Denver', 'Atlanta', 'Miami']

skills_categories = ['Technical', 'Management', 'Communication', 'Leadership', 'Analytical']

def generate_employee_data(n_samples=100000):
    """Generate synthetic employee dataset with realistic correlations"""
    
    data = []
    
    for i in range(n_samples):
        # Basic demographics
        age = np.random.normal(35, 10)
        age = max(22, min(65, int(age)))  # Clamp between 22 and 65
        
        # Education level (correlated with age)
        if age < 25:
            education = np.random.choice(['High School', 'Associate', 'Bachelor'], 
                                        p=[0.3, 0.2, 0.5])
        elif age < 30:
            education = np.random.choice(['Bachelor', 'Master', 'MBA'], 
                                        p=[0.5, 0.4, 0.1])
        else:
            education = np.random.choice(['Bachelor', 'Master', 'PhD', 'MBA'], 
                                        p=[0.3, 0.4, 0.15, 0.15])
        
        # Years of experience (correlated with age)
        max_experience = age - 22
        years_experience = min(max_experience, int(np.random.exponential(8)))
        
        # Department and position
        department = random.choice(departments)
        
        # Position based on experience and education
        if years_experience < 2:
            position = np.random.choice(['Intern', 'Junior'], p=[0.3, 0.7])
        elif years_experience < 5:
            position = np.random.choice(['Junior', 'Mid-Level'], p=[0.4, 0.6])
        elif years_experience < 10:
            position = np.random.choice(['Mid-Level', 'Senior', 'Lead'], p=[0.3, 0.5, 0.2])
        elif years_experience < 15:
            position = np.random.choice(['Senior', 'Lead', 'Manager'], p=[0.3, 0.4, 0.3])
        elif years_experience < 20:
            position = np.random.choice(['Manager', 'Senior Manager', 'Director'], 
                                       p=[0.3, 0.4, 0.3])
        else:
            position = np.random.choice(['Director', 'Senior Director', 'VP', 'Senior VP', 'C-Level'], 
                                       p=[0.3, 0.25, 0.25, 0.15, 0.05])
        
        # Performance score (normal distribution)
        performance_score = np.random.normal(3.5, 0.8)
        performance_score = max(1.0, min(5.0, round(performance_score, 1)))
        
        # Location
        location = random.choice(locations)
        
        # Skills rating (1-10)
        technical_skills = np.random.normal(6, 2)
        technical_skills = max(1, min(10, round(technical_skills, 1)))
        
        soft_skills = np.random.normal(6.5, 1.8)
        soft_skills = max(1, min(10, round(soft_skills, 1)))
        
        # Certifications (more likely with higher education and experience)
        cert_probability = 0.1 + (years_experience * 0.02) + (0.1 if education in ['Master', 'PhD', 'MBA'] else 0)
        certifications = int(np.random.binomial(5, min(cert_probability, 0.7)))
        
        # Projects completed (correlated with experience)
        projects_completed = int(np.random.poisson(years_experience * 2))
        
        # Work hours per week
        work_hours = np.random.normal(42, 5)
        work_hours = max(35, min(60, round(work_hours, 1)))
        
        # Remote work percentage
        remote_work_pct = np.random.beta(2, 3) * 100
        remote_work_pct = round(remote_work_pct, 1)
        
        # Calculate salary based on multiple factors
        base_salary = 30000
        
        # Education multiplier
        edu_multipliers = {
            'High School': 1.0,
            'Associate': 1.15,
            'Bachelor': 1.4,
            'Master': 1.7,
            'PhD': 2.0,
            'MBA': 1.9
        }
        
        # Position multiplier
        pos_multipliers = {
            'Intern': 0.6,
            'Junior': 1.0,
            'Mid-Level': 1.5,
            'Senior': 2.2,
            'Lead': 2.8,
            'Manager': 3.2,
            'Senior Manager': 4.0,
            'Director': 5.5,
            'Senior Director': 7.0,
            'VP': 9.0,
            'Senior VP': 11.0,
            'C-Level': 15.0
        }
        
        # Department multiplier
        dept_multipliers = {
            'IT': 1.3,
            'Engineering': 1.35,
            'Data Science': 1.4,
            'Product Management': 1.3,
            'Finance': 1.25,
            'Legal': 1.3,
            'R&D': 1.25,
            'Sales': 1.2,
            'Marketing': 1.15,
            'Operations': 1.1,
            'HR': 1.05,
            'Customer Service': 1.0
        }
        
        # Location multiplier (cost of living)
        loc_multipliers = {
            'San Francisco': 1.5,
            'New York': 1.45,
            'Seattle': 1.35,
            'Boston': 1.3,
            'Los Angeles': 1.25,
            'Denver': 1.15,
            'Austin': 1.15,
            'Chicago': 1.2,
            'Atlanta': 1.1,
            'Miami': 1.1
        }
        
        salary = base_salary
        salary *= edu_multipliers[education]
        salary *= pos_multipliers[position]
        salary *= dept_multipliers[department]
        salary *= loc_multipliers[location]
        salary *= (1 + years_experience * 0.03)  # 3% per year of experience
        salary *= (1 + (performance_score - 3) * 0.1)  # Performance impact
        salary *= (1 + technical_skills * 0.02)  # Technical skills impact
        salary *= (1 + soft_skills * 0.015)  # Soft skills impact
        salary *= (1 + certifications * 0.03)  # Certifications impact
        
        # Add some random variation
        salary *= np.random.normal(1.0, 0.1)
        salary = max(25000, round(salary, 2))
        
        # Bonus (percentage of salary)
        bonus_pct = np.random.beta(2, 5) * 30
        bonus = round(salary * (bonus_pct / 100), 2)
        
        # Benefits value
        benefits = round(salary * np.random.uniform(0.15, 0.30), 2)
        
        # Total compensation
        total_compensation = salary + bonus + benefits
        
        employee = {
            'employee_id': f'EMP{str(i+1).zfill(6)}',
            'age': age,
            'years_experience': years_experience,
            'education': education,
            'department': department,
            'position': position,
            'location': location,
            'performance_score': performance_score,
            'technical_skills': technical_skills,
            'soft_skills': soft_skills,
            'certifications': certifications,
            'projects_completed': projects_completed,
            'work_hours_per_week': work_hours,
            'remote_work_percentage': remote_work_pct,
            'base_salary': salary,
            'bonus': bonus,
            'benefits': benefits,
            'total_compensation': total_compensation
        }
        
        data.append(employee)
    
    return pd.DataFrame(data)

if __name__ == '__main__':
    print("Generating synthetic employee dataset...")
    print("This may take a minute...")
    
    df = generate_employee_data(100000)
    
    # Save to CSV
    df.to_csv(DATASET_PATH, index=False)
    
    print(f"\n✓ Dataset generated successfully!")
    print(f"Total employees: {len(df)}")
    print(f"\nDataset Statistics:")
    print(f"Average Salary: ${df['base_salary'].mean():,.2f}")
    print(f"Median Salary: ${df['base_salary'].median():,.2f}")
    print(f"Salary Range: ${df['base_salary'].min():,.2f} - ${df['base_salary'].max():,.2f}")
    print(f"\nAverage Experience: {df['years_experience'].mean():.1f} years")
    print(f"Average Age: {df['age'].mean():.1f} years")
    print(f"\nDepartment Distribution:")
    print(df['department'].value_counts())
    print(f"\nPosition Distribution:")
    print(df['position'].value_counts())
    print(f"\nEducation Distribution:")
    print(df['education'].value_counts())
    print(f"\nDataset saved to: {DATASET_PATH}")
