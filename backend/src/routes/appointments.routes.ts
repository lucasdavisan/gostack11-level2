import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

/** Route: should always be concerned with receiving the requisiton,
 *  call another file and return a response. Otherwise we must be
 * 	abstract in a Service. */

appointmentsRouter.get('/', async (request, response) => {
	const appointmentsRepository = getCustomRepository(AppointmentsRepository);
	const appointments = await appointmentsRepository.find();

	return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
	try {
		const { provider, date } = request.body;

		const parsedDate = parseISO(date);

		const createAppointment = new CreateAppointmentService();

		const appointment = await createAppointment.execute({
			date: parsedDate,
			provider,
		});

		return response.json(appointment);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default appointmentsRouter;
