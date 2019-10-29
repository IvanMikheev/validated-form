import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, FormFeedback, Label, Input, CustomInput, Alert } from 'reactstrap';
import './FormContainer.css'

const validateForm = ({ errorsMessage, formValues }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(errorsMessage).forEach(val => {
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
      alertSuccessVisible: false,
      alertErrorVisible: false,
      formValues: {
        firstName: '',
        lastName: '',
        birthday: '',
        gender: 'Не указан',
        education: '',
        isMarried: false,
      },
      errorsMessage: {
        firstName: '',
        lastName: '',
        birthday: '',
        education: ''
      },
      postError: false,
      postErrorResponse: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let { errorsMessage, formValues } = this.state;

    switch (name) {
      case 'firstName':
        errorsMessage.firstName = value.length < 3 ? 'Имя должно содержать не менее 3 символов' : '';
        break;
      case 'lastName':
        errorsMessage.lastName = value.length < 3 ? 'Фамилия должна содержать не менее 3 символов' : '';
        break;
      case 'birthday':
        errorsMessage.birthday = value === '' ? 'Заполните дату' : '';
        break;
      case 'education':
        errorsMessage.education = value === '' ? 'Выберите образование' : '';
        break;
      default:
        break;
    }
    formValues[name] = value;
    this.setState({
      errorsMessage,
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
    let { errorsMessage, formValues } = this.state;

    Object.keys(formValues).forEach(key => {
      (formValues[key] === '') && (errorsMessage[key] = getErrorMessage(key));
    });

    this.setState({ errorsMessage });

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
          (postErrorResponse) => {
            this.setState({
               postErrorResponse,
               postError: true
              });
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

      if (this.state.postError) {
        this.setState({ alertSuccessVisible: true, formValues }, () => {
          window.setTimeout(() => {
            this.setState({ alertSuccessVisible: false })
          }, 3000)
        });
       } else {
        console.error(this.state.postErrorResponse);
        this.setState({ alertErrorVisible: true }, () => {
          window.setTimeout(() => {
            this.setState({ alertErrorVisible: false })
          }, 10000)
        });
      }
      
    } else {
      console.error('Invalid Form')
    }
  }

  render() {
    const { errorsMessage, formValues } = this.state;    

    return (

      <Form onSubmit={this.handleSubmit} className="form">
        <Alert color="success" isOpen={this.state.alertSuccessVisible} >
          Данные успешно добавлены!
        </Alert>

        <Alert color="danger" isOpen={this.state.alertErrorVisible} >
          Ошибка запроса!!
        </Alert>

        <FormGroup>
          <Label for="firstName">Имя</Label>
          <Input
            invalid={errorsMessage.firstName.length > 0}
            type="text"
            name="firstName"
            onChange={this.handleChange}
            value={formValues.firstName}
          />
          <FormFeedback invalid={errorsMessage.firstName.length > 0 ? 'true' : 'false'}>
            {errorsMessage.firstName}
          </FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="lastName">Фамилия</Label>
          <Input
            invalid={errorsMessage.lastName.length > 0}
            type="text"
            name="lastName"
            onChange={this.handleChange}
            value={formValues.lastName}
          />
          <FormFeedback invalid={errorsMessage.lastName.length > 0 ? 'true' : 'false'}>{errorsMessage.lastName}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="birthday">Дата рождения</Label>
          <Input
            invalid={errorsMessage.birthday.length > 0}
            type="date"
            name="birthday"
            onChange={this.handleChange}
            value={formValues.birthday}
          />
          <FormFeedback invalid={errorsMessage.birthday.length > 0 ? 'true' : 'false'}>{errorsMessage.birthday}</FormFeedback>
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
            invalid={errorsMessage.education.length > 0}
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
          <FormFeedback invalid={errorsMessage.education.length > 0 ? 'true' : 'false'}>{errorsMessage.education}</FormFeedback>
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
