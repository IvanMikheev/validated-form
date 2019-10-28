import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, FormFeedback, Label, Input, CustomInput, Alert } from 'reactstrap';
import './FormContainer.css'

const validateForm = ({ errors, formValues }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(errors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(formValues).forEach(val => {
    (val === '') && (valid = false);
  });

  return valid;
}

const getErrorMessage = (name) => {
  switch (name) {
    case 'firstName':
      return 'Имя должно содержать не менее 3 символов';
    case 'lastName':
      return 'Фамилия должна содержать не менее 3 символов';
    case 'birthday':
      return 'Заполните дату';
    case 'education':
      return 'Выберите образование';
    default:
      return '';
  }
}

export class FormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alertVisible: false,
      formValues: {
        firstName: '',
        lastName: '',
        birthday: '',
        gender: 'Не указан',
        education: '',
        isMarried: false,
      },
      errors: {
        firstName: '',
        lastName: '',
        birthday: '',
        education: ''
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let { errors, formValues } = this.state;

    switch (name) {
      case 'firstName':
        errors.firstName = value.length < 3 ? 'Имя должно содержать не менее 3 символов' : '';
        break;
      case 'lastName':
        errors.lastName = value.length < 3 ? 'Фамилия должна содержать не менее 3 символов' : '';
        break;
      case 'birthday':
        errors.birthday = value === '' ? 'Заполните дату' : '';
        break;
      case 'education':
        errors.education = value === '' ? 'Выберите образование' : '';
        break;
      default:
        break;
    }
    formValues[name] = value;
    this.setState({
      errors,
      formValues
    });
  }

  handleCheckboxChange = () => {
    let formValues = this.state.formValues;
    formValues.isMarried = !formValues.isMarried;
    this.setState({
      formValues
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let { errors, formValues } = this.state;

    Object.keys(formValues).forEach(key => {
      (formValues[key] === '') && (errors[key] = getErrorMessage(key));
    });

    this.setState({ errors });

    if (validateForm(this.state)) {
      const apiUrl = 'http://localhost:5000/api/people/';

      axios.post(apiUrl, JSON.stringify(this.state.formValues), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(result => {
          this.setState({
            response: result,
          })
        },
          (postError) => {
            this.setState({ postError });
          }
        );

      console.info(`
          ==Submitting==
        firstName: ${formValues.firstName}
        lastName: ${formValues.lastName}
        birthday: ${formValues.birthday}
        gender: ${formValues.gender}
        education: ${formValues.education}
        isMarried: ${formValues.isMarried}
      `);

      formValues = {
        firstName: '',
        lastName: '',
        birthday: '',
        gender: 'Не указан',
        education: '',
        isMarried: false,
      }

      this.setState({ alertVisible: true, formValues }, () => {
        window.setTimeout(() => {
          this.setState({ alertVisible: false })
        }, 3000)
      });
    } else {
      console.error('Invalid Form')
    }
  }

  render() {
    const { errors, formValues } = this.state;
    return (

      <Form onSubmit={this.handleSubmit} className="form">
        <Alert color="success" isOpen={this.state.alertVisible} >
          Данные успешно добавлены!
        </Alert>

        <FormGroup>
          <Label for="firstName">Имя</Label>
          <Input
            invalid={errors.firstName.length > 0}
            type="text"
            name="firstName"
            onChange={this.handleChange}
            value={formValues.firstName}
          />
          <FormFeedback invalid={errors.firstName.length > 0 ? 'true' : 'false'}>
            {errors.firstName}
          </FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="lastName">Фамилия</Label>
          <Input
            invalid={errors.lastName.length > 0}
            type="text"
            name="lastName"
            onChange={this.handleChange}
            value={formValues.lastName}
          />
          <FormFeedback invalid={errors.lastName.length > 0 ? 'true' : 'false'}>{errors.lastName}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="birthday">Дата рождения</Label>
          <Input
            invalid={errors.birthday.length > 0}
            type="date"
            name="birthday"
            onChange={this.handleChange}
            value={formValues.birthday}
          />
          <FormFeedback invalid={errors.birthday.length > 0 ? 'true' : 'false'}>{errors.birthday}</FormFeedback>
        </FormGroup>

        <FormGroup tag="fieldset">
          <Label>Пол</Label>
          <div >
            <CustomInput
              id="gender1"
              onChange={this.handleChange}
              value="Не указан"
              label="Не указан"
              name="gender"
              type="radio"
              checked={formValues.gender === "Не указан"}
            />
            <CustomInput
              id="gender2"
              onChange={this.handleChange}
              value="Мужской"
              label="Мужской"
              name="gender"
              type="radio"
              checked={formValues.gender === "Мужской"}
            />
            <CustomInput
              id="gender3"
              onChange={this.handleChange}
              value="Женский"
              label="Женский"
              name="gender"
              type="radio"
              checked={formValues.gender === "Женский"}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="education">Образование</Label>
          <Input
            invalid={errors.education.length > 0}
            type="select"
            name="education"
            value={formValues.education}
            onChange={this.handleChange}
          >
            <option value=""></option>
            <option value="Начальное">Начальное</option>
            <option value="Среднее">Среднее</option>
            <option value="Среднее профессиональное">Среднее профессиональное</option>
            <option value="Высшее">Высшее</option>
          </Input>
          <FormFeedback invalid={errors.education.length > 0 ? 'true' : 'false'}>{errors.education}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <CustomInput
            id="married"
            name="isMarried"
            label="Состоите в браке"
            type="checkbox"
            checked={formValues.isMarried}
            onChange={this.handleCheckboxChange} />

        </FormGroup>
        <Button color="primary" type="submit">Подтвердить</Button>
      </Form>
    )
  }
}

export default FormContainer
