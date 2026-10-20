<template>
	<div
		class="h-full overflow-hidden lg:flex lg:flex-shrink-0"
		:class="mobileNavOpen ? 'fixed inset-0 z-50 flex bg-black/40 lg:static lg:inset-auto lg:z-40 lg:bg-transparent' : 'hidden lg:flex'"
		@click.self="closeMobileNav"
	>
		<div :class="['relative z-40 flex h-full flex-col bg-primary-800 transition-all duration-150', showLabels ? 'w-64' : 'w-20']">
			<div class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-primary-800">
				<div class="flex-1">
					<div class="flex items-center justify-center bg-primary-800 py-4">
						<div class="flex justify-center py-6 text-white">
							<span>
								<svg
									height="15px"
									version="1.1"
									viewBox="0 0 27 15"
									width="27px"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
								>
									<g
										id="Page-1"
										fill="none"
										fill-rule="evenodd"
										stroke="none"
										stroke-width="1"
									>
										<g
											id="Group-16"
											fill="currentColor"
											transform="translate(-28.000000, -31.000000)"
										>
											<g
												id="Group"
												transform="translate(28.000000, 31.000000)"
											>
												<path
													id="Rectangle"
													d="M17.5217391,0 C19.4427296,0 21,1.52630199 21,3.40909091 L21,11.5909091 C21,13.473698 19.4427296,15 17.5217391,15 L8.47826087,15 C6.55727044,15 5,13.473698 5,11.5909091 L5,11 L8.478,11 L8.47826087,11.5909091 L17.5217391,11.5909091 L17.5217391,3.40909091 L8.47826087,3.40909091 L8.478,4 L5,4 L5,3.40909091 C5,1.52630199 6.55727044,0 8.47826087,0 L17.5217391,0 Z"
													fill-rule="nonzero"
												/>
												<polygon
													id="Path"
													fill-rule="nonzero"
													points="13 6 13 9 0 9 0 6"
												/>
												<rect
													id="Rectangle"
													height="3"
													width="4"
													x="23"
													y="6"
												/>
											</g>
										</g>
									</g>
								</svg>
							</span>
						</div>
					</div>
					<nav
						class="flex flex-1 flex-col space-y-1 px-2 py-4"
						:class="showLabels ? 'items-stretch' : 'items-center'"
					>
						<nuxt-link
							to="/dashboard"
							:title="showLabels ? undefined : 'Clients'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 32 32"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<circle
									cx="9"
									cy="6"
									r="1"
									fill="currentColor"
								/>
								<path
									fill="currentColor"
									d="M26 10H6a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2ZM6 4v4h20V4Z"
								/>
								<circle
									cx="9"
									cy="16"
									r="1"
									fill="currentColor"
								/>
								<path
									fill="currentColor"
									d="M26 20H6a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2ZM6 14v4h20v-4Z"
								/>
								<circle
									cx="9"
									cy="26"
									r="1"
									fill="currentColor"
								/>
								<path
									fill="currentColor"
									d="M26 30H6a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2ZM6 24v4h20v-4Z"
								/>
							</svg>
							<span v-if="showLabels">Clients</span>
						</nuxt-link>

						<nuxt-link
							to="/tunnels"
							:title="showLabels ? undefined : 'Tunnels'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<g fill="currentColor">
									<path
										d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4v2h1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h1v-2H5a3 3 0 0 1-3-3V6zm9 11v2h2v-2h-2zM5 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5z"
									/>
								</g>
							</svg>
							<span v-if="showLabels">Tunnels</span>
							<!-- <span
                                class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> -->
						</nuxt-link>
						<nuxt-link
							to="/commands"
							:title="showLabels ? undefined : 'Commands'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<g fill="currentColor">
									<path
										d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5zm1.617 2.076a1 1 0 0 1 1.09.217l4 4a1 1 0 0 1 0 1.414l-4 4A1 1 0 0 1 6 16V8a1 1 0 0 1 .617-.924zM8 10.414v3.172L9.586 12L8 10.414zM12 16a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1z"
									/>
								</g>
							</svg>
							<span v-if="showLabels">Commands</span>
						</nuxt-link>
						<nuxt-link
							to="/schedules"
							:title="showLabels ? undefined : 'Schedules'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m5 11.9l-.7 1.3l-5.3-2.9V7h1.5v4.4l4.5 2.5Z"
								/>
							</svg>
							<span v-if="showLabels">Schedules</span>
						</nuxt-link>
						<nuxt-link
							to="/profile"
							:title="showLabels ? undefined : 'Settings'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M13.875 22h-3.75q-.375 0-.65-.25t-.325-.625l-.3-2.325q-.325-.125-.613-.3t-.562-.375l-2.175.9q-.35.125-.7.025t-.55-.425L2.4 15.4q-.2-.325-.125-.7t.375-.6l1.875-1.425Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L2.65 9.9q-.3-.225-.375-.6t.125-.7l1.85-3.225q.175-.35.537-.438t.713.038l2.175.9q.275-.2.575-.375t.6-.3l.3-2.325q.05-.375.325-.625t.65-.25h3.75q.375 0 .65.25t.325.625l.3 2.325q.325.125.613.3t.562.375l2.175-.9q.35-.125.7-.025t.55.425L21.6 8.6q.2.325.125.7t-.375.6l-1.875 1.425q.025.175.025.338v.674q0 .163-.05.338l1.875 1.425q.3.225.375.6t-.125.7l-1.85 3.2q-.2.325-.563.438t-.712-.013l-2.125-.9q-.275.2-.575.375t-.6.3l-.3 2.325q-.05.375-.325.625t-.65.25Zm-1.825-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.012 2.475T12.05 15.5Zm0-2q-.625 0-1.063-.438T10.55 12q0-.625.438-1.063t1.062-.437q.625 0 1.063.438T13.55 12q0 .625-.438 1.063t-1.062.437ZM12 12Zm-1 8h1.975l.35-2.65q.775-.2 1.438-.588t1.212-.937l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12q0-.4-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587L11 20Z"
								/>
							</svg>
							<span v-if="showLabels">Settings</span>
						</nuxt-link>
						<nuxt-link
							to="/audits"
							:title="showLabels ? undefined : 'Audit Logs'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M15.5 12c2.5 0 4.5 2 4.5 4.5c0 .88-.25 1.71-.69 2.4l3.08 3.1L21 23.39l-3.12-3.07c-.69.43-1.51.68-2.38.68c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5m0 2a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5M5 3h14c1.11 0 2 .89 2 2v8.03c-.5-.8-1.19-1.49-2-2.03V5H5v14h4.5c.31.75.76 1.42 1.31 2H5c-1.11 0-2-.89-2-2V5c0-1.11.89-2 2-2m2 4h10v2H7V7m0 4h5.03c-.8.5-1.49 1.19-2.03 2H7v-2m0 4h2.17c-.11.5-.17 1-.17 1.5v.5H7v-2Z"
								/>
							</svg>
							<span v-if="showLabels">Audit Logs</span>
						</nuxt-link>
						<a
							href="#"
							:title="showLabels ? undefined : 'Logout'"
							:class="['flex min-h-11 w-full items-center rounded-lg py-2 text-sm text-primary-50 transition-all duration-150 hover:bg-primary-700', showLabels ? 'justify-start gap-x-3 px-3' : 'justify-center px-2']"
							@click="logout"
						>
							<svg
								data-v-ca945699=""
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								class="icon h-6 w-6"
								aria-hidden="true"
							>
								<path
									fill="currentColor"
									d="M15.325 16.275q-.275-.325-.275-.737t.275-.688l1.85-1.85H10q-.425 0-.713-.288T9 12q0-.425.288-.713T10 11h7.175l-1.85-1.85q-.3-.3-.3-.713t.3-.712q.275-.3.688-.3t.687.275l3.6 3.6q.15.15.213.325t.062.375q0 .2-.062.375t-.213.325l-3.6 3.6q-.325.325-.713.288t-.662-.313ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h6q.425 0 .713.288T12 20q0 .425-.288.713T11 21H5Z"
								/>
							</svg>
							<span v-if="showLabels">Logout</span>
						</a>
					</nav>
				</div>
				<div class="flex flex-shrink-0 flex-col items-center gap-y-4 pb-5">
					<div class="hidden lg:block">
						<button
							class="bg-primary hover:bg-vtd-primary-700 focus-visible:outline-vtd-primary-600 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:focus-visible:outline-gray-400 text-white disabled:text-gray-500 cursor-pointer rounded-md px-2.5 py-1.5 text-sm relative font-semibold shadow-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
							type="button"
							@click="toggleNavBar"
						>
							<span class="flex items-center justify-center gap-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20px"
									height="20px"
									viewBox="0 0 24 24"
									class="icon rotate-90 transition-all"
								>
									<path
										fill="currentColor"
										d="m16 12l2 2v2h-5v6l-1 1l-1-1v-6H6v-2l2-2V5H7V3h10v2h-1v7Zm-7.15 2h6.3L14 12.85V5h-4v7.85L8.85 14ZM12 14Z"
									/>
								</svg>

							</span>
						</button>
					</div>
					<nuxt-link
						to="/profile"
						class="w-full flex-shrink-0"
					>
						<div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-700">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 256 256"
								class="icon mx-auto block h-6 w-6"
							>
								<path
									fill="currentColor"
									d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56Z"
								/>
							</svg>
						</div>
					</nuxt-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const store = useTokenStore();
const router = useRouter();
const route = useRoute();
const isNavBarOpen = useLocalStorage('main_nav_open', false);
const { mobileNavOpen, closeMobileNav } = useAppShell();
const showLabels = computed(() => mobileNavOpen.value || isNavBarOpen.value);

const toggleNavBar = () => {
	isNavBarOpen.value = !isNavBarOpen.value;
};

watch(() => route.fullPath, () => {
	closeMobileNav();
});

const logout = async () => {
	await store.logOut();
	router.push('/auth');
};
</script>
